import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { assistantMessagesLeft } from '../domain/plans';
import { dateKey } from '../domain/schedule';
import type { ChatMessage } from '../domain/types';
import { askAssistant, assistantConfigured, type AssistantMode } from '../services/assistant';
import { newId, useStore } from '../state/AppStore';
import { Chip, colors, Muted, Row, styles } from './ui';

const STARTERS: Record<AssistantMode, string[]> = {
  homework: ['Explain this step by step:', 'Check my answer:', 'Quiz me on', 'Help me understand'],
  research: ['Help me outline a project on', 'Find angles for a report about', 'Summarise the key ideas of', 'What sources should I look for on'],
};

export function AssistantChat() {
  const { data, appendChat, clearChat, countAssistantMessage } = useStore();
  const [mode, setMode] = useState<AssistantMode>('homework');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const left = assistantMessagesLeft(data, dateKey(new Date()));
  const configured = assistantConfigured();

  const send = async () => {
    const text = input.trim();
    if (!text || busy || left <= 0) return;
    setError(null);
    const msg: ChatMessage = { id: newId(), role: 'user', content: text, at: Date.now() };
    appendChat(msg);
    countAssistantMessage();
    setInput('');
    setBusy(true);
    try {
      const reply = await askAssistant([...data.chat, msg], mode);
      appendChat({ id: newId(), role: 'assistant', content: reply, at: Date.now() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          <Chip label="📚 Homework" selected={mode === 'homework'} onPress={() => setMode('homework')} />
          <Chip label="🔎 Research" selected={mode === 'research'} onPress={() => setMode('research')} />
        </Row>
        {data.chat.length ? (
          <Pressable onPress={clearChat} hitSlop={8}>
            <Text style={{ color: colors.muted }}>Clear</Text>
          </Pressable>
        ) : null}
      </Row>

      {!configured ? (
        <Muted style={{ marginTop: 8, color: colors.warning }}>
          Assistant server not configured. Set EXPO_PUBLIC_ASSISTANT_URL — see README.
        </Muted>
      ) : null}

      <FlatList
        ref={listRef}
        style={{ flex: 1, marginTop: 10 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
        data={data.chat}
        keyExtractor={(m) => m.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={{ gap: 10, marginTop: 20 }}>
            <Muted>Ask about homework or research. Try:</Muted>
            <Row>
              {STARTERS[mode].map((s) => (
                <Chip key={s} label={s} onPress={() => setInput(s + ' ')} />
              ))}
            </Row>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: item.role === 'user' ? colors.primary : colors.card,
              borderRadius: 14,
              padding: 12,
              borderWidth: item.role === 'user' ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <Text selectable style={[styles.text, item.role === 'user' && { color: colors.primaryText }]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      {busy ? <ActivityIndicator color={colors.primary} style={{ marginBottom: 8 }} /> : null}
      {error ? <Text style={{ color: colors.danger, marginBottom: 6 }}>{error}</Text> : null}
      <Muted style={{ fontSize: 12, marginBottom: 6 }}>
        {left > 0 ? `${left} messages left today` : 'Daily message limit reached — upgrade for more.'}
      </Muted>
      <Row style={{ flexWrap: 'nowrap', marginBottom: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={mode === 'homework' ? 'Ask a homework question…' : 'What are you researching?'}
          placeholderTextColor={colors.muted}
          multiline
          style={[styles.input, { flex: 1, maxHeight: 120 }]}
        />
        <Pressable
          onPress={send}
          disabled={busy || !input.trim() || left <= 0}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            opacity: busy || !input.trim() || left <= 0 ? 0.4 : 1,
          }}
        >
          <Text style={{ color: colors.primaryText, fontWeight: '800' }}>Send</Text>
        </Pressable>
      </Row>
    </KeyboardAvoidingView>
  );
}
