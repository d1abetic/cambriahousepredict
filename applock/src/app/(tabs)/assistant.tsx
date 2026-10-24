import { AssistantChat } from '../../components/AssistantChat';
import { H1, Screen } from '../../components/ui';

export default function Assistant() {
  return (
    <Screen scroll={false}>
      <H1>Study assistant</H1>
      <AssistantChat />
    </Screen>
  );
}
