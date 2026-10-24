import { Text, View } from 'react-native';

import { Button, Card, colors, confirm, Field, H1, H2, Muted, Row, Screen, styles } from '../../components/ui';
import { PLAN_FEATURES, PLANS } from '../../domain/plans';
import type { PlanId } from '../../domain/types';
import { deviceLock } from '../../services/deviceLock';
import { useStore } from '../../state/AppStore';

const PLAN_IDS: PlanId[] = ['free', 'premium'];

export default function Account() {
  const { data, updateProfile, setPlan, resetAll } = useStore();

  return (
    <Screen>
      <H1>Account</H1>

      <Card>
        <H2>Profile</H2>
        <Field label="Name" value={data.profile.name} onChangeText={(name) => updateProfile({ name })} placeholder="Your name" />
        <Field
          label="Email"
          value={data.profile.email}
          onChangeText={(email) => updateProfile({ email })}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Muted>Stored on this device only. Cloud accounts & sync come with sign-in.</Muted>
      </Card>

      <H2>Plans</H2>
      <Row style={{ alignItems: 'stretch' }}>
        {PLAN_IDS.map((id) => {
          const p = PLANS[id];
          const current = data.plan === id;
          return (
            <Card
              key={id}
              style={[{ flex: 1, minWidth: 150 }, current && { borderColor: id === 'premium' ? colors.premium : colors.primary, borderWidth: 2 }]}
            >
              <Text style={[styles.text, { fontWeight: '800', fontSize: 18 }]}>
                {id === 'premium' ? '⭐ ' : ''}
                {p.label}
              </Text>
              <Muted>{p.priceLabel}</Muted>
              {current ? (
                <Text style={{ color: colors.success, fontWeight: '700' }}>Current plan</Text>
              ) : (
                <Button
                  title={id === 'premium' ? 'Upgrade' : 'Switch to Free'}
                  variant={id === 'premium' ? 'primary' : 'secondary'}
                  onPress={() =>
                    confirm(
                      id === 'premium' ? 'Upgrade to Premium' : 'Switch to Free',
                      'Billing is not connected yet — this switches the plan locally so you can preview the tier.',
                      'Switch',
                      () => setPlan(id),
                    )
                  }
                />
              )}
            </Card>
          );
        })}
      </Row>

      <Card style={{ gap: 0, padding: 0, overflow: 'hidden' }}>
        <Row style={{ padding: 12, backgroundColor: colors.cardAlt, flexWrap: 'nowrap' }}>
          <Text style={[styles.label, { flex: 2 }]}>Feature</Text>
          {PLAN_IDS.map((id) => (
            <Text key={id} style={[styles.label, { flex: 1, textAlign: 'center' }]}>
              {PLANS[id].label}
            </Text>
          ))}
        </Row>
        {PLAN_FEATURES.map((f, i) => (
          <View key={f.label} style={{ flexDirection: 'row', padding: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border }}>
            <Text style={[styles.text, { flex: 2, fontSize: 14 }]}>{f.label}</Text>
            {PLAN_IDS.map((id) => (
              <Text key={id} style={[styles.text, { flex: 1, textAlign: 'center', fontSize: 14 }]}>
                {f.value(PLANS[id])}
              </Text>
            ))}
          </View>
        ))}
      </Card>

      <Card>
        <H2>Device lock</H2>
        <Muted>
          {deviceLock.available
            ? 'System-level blocking is available in this build.'
            : 'This build locks the app itself and reminds you when a lock starts. System-wide blocking of other apps needs the native module described in the README.'}
        </Muted>
        {deviceLock.available ? (
          <Button title="Grant device-lock permission" variant="secondary" onPress={() => deviceLock.requestAuthorization()} />
        ) : null}
      </Card>

      <Button
        title="Reset all data"
        variant="danger"
        onPress={() => confirm('Reset everything?', 'Schedules, history, music and chat will be erased.', 'Reset', resetAll)}
      />
    </Screen>
  );
}
