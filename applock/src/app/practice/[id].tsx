import { useLocalSearchParams, useRouter } from 'expo-router';

import { ChallengeRunner } from '../../components/challenges/ChallengeRunner';
import { Card, H1, Muted, notify, Screen } from '../../components/ui';
import { findChallenge } from '../../domain/challenges';
import { useStore } from '../../state/AppStore';

/** Run a challenge outside a lock — still counts toward goals and streaks. */
export default function Practice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, recordCompletion } = useStore();
  const challenge = findChallenge(data.customChallenges, id);

  if (!challenge) {
    return (
      <Screen edges={['bottom']}>
        <Muted>Challenge not found.</Muted>
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <H1>{challenge.title}</H1>
      <Muted>{challenge.description}</Muted>
      <Card>
        <ChallengeRunner
          challenge={challenge}
          onComplete={(proof) => {
            recordCompletion({
              challengeId: challenge.id,
              category: challenge.category,
              completedAt: Date.now(),
              ...proof,
            });
            notify('Nice work! 🎉', 'Logged toward your goals and streak.');
            router.back();
          }}
        />
      </Card>
    </Screen>
  );
}
