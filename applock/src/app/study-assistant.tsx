import { AssistantChat } from '../components/AssistantChat';
import { Screen } from '../components/ui';

/** Same assistant, reachable from the lock screen. */
export default function StudyAssistant() {
  return (
    <Screen scroll={false} edges={['bottom']}>
      <AssistantChat />
    </Screen>
  );
}
