import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Empty } from "@/components/ui";
import { api, type Exercise } from "@/lib/api";
import { todayInRecife } from "@/lib/format";
import { colors, space } from "@/theme";

export function TreinoScreen({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const routines = useQuery({
    queryKey: ["routines", studentId],
    queryFn: () => api.routines(studentId),
  });
  const routine = routines.data?.data[0];
  const session = useMutation({
    mutationFn: (trainingId: string) =>
      api.completeSession({
        studentId,
        trainingId,
        routineId: routine?.id,
        date: todayInRecife(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines", studentId] }),
  });

  if (routines.isSuccess && !routine) {
    return <Empty text="Nenhuma rotina atribuída ainda." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {routine ? (
        <Text style={styles.meta}>
          {routine.name} · {routine.completedSessions ?? 0} sessões feitas
        </Text>
      ) : null}
      {routine?.trainings.map((training) => (
        <Card key={training.id}>
          <Text style={styles.title}>
            {training.code} — {training.name}
          </Text>
          <Text style={styles.meta}>
            {[training.focus, training.dayOfWeek, training.duration].filter(Boolean).join(" · ")}
          </Text>
          {training.exercises.map((exercise, index) => (
            <ExerciseLine key={`${training.id}-${index}`} exercise={exercise} />
          ))}
          <View style={styles.action}>
            <Button
              label={session.isSuccess ? "Registrado" : "Fiz hoje"}
              onPress={() => session.mutate(training.id)}
              loading={session.isPending}
            />
          </View>
          {session.isError ? <Text style={styles.error}>Não foi possível registrar o treino.</Text> : null}
        </Card>
      ))}
    </ScrollView>
  );
}

function ExerciseLine({ exercise }: { exercise: Exercise }) {
  const detail = [
    `${exercise.sets}x${exercise.reps}`,
    exercise.load != null ? `${exercise.load} kg` : null,
    exercise.cadence ? `cadência ${exercise.cadence}` : null,
    exercise.rest ? `descanso ${exercise.rest}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.exercise}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.meta}>{detail}</Text>
      {exercise.mediaUrl ? (
        <Text style={styles.link} onPress={() => Linking.openURL(exercise.mediaUrl!)}>
          Ver vídeo
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.md },
  title: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.muted, fontSize: 13, marginTop: 2 },
  exercise: { marginTop: space.sm },
  exerciseName: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  link: { color: colors.navy, marginTop: 2, fontWeight: "700" },
  action: { marginTop: space.md },
  error: { color: colors.maroon, marginTop: space.sm },
});
