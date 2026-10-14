import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { ConfirmButton } from "@/components/confirm-button";
import { Enter } from "@/components/motion";
import { MuscleMark } from "@/components/muscle-mark";
import { WeekRail, type RailDay } from "@/components/week-rail";
import { api, type Exercise, type Training, type TrainingSession } from "@/lib/api";
import { todayInRecife } from "@/lib/format";
import { dayKey, WEEK_LABELS, weekdayIndex, weekInRecife } from "@/lib/week";
import { colors, font, radius, shadow, space } from "@/theme";

const RASTER = /\.(png|jpe?g|webp|gif|avif)(\?|#|$)/i;

function buildDays(trainings: Training[], sessions: TrainingSession[], today: string): RailDay[] {
  const { dates, todayIndex } = weekInRecife(today);
  const days: RailDay[] = WEEK_LABELS.map((label, index) => ({
    label,
    codes: [],
    prescribed: false,
    done: false,
    today: index === todayIndex,
  }));

  for (const training of trainings) {
    const index = weekdayIndex(training.dayOfWeek);
    if (index == null) continue;
    days[index].prescribed = true;
    if (!days[index].codes.includes(training.code)) days[index].codes.push(training.code);
  }

  const doneOn = new Set(
    sessions.filter((session) => session.status === "COMPLETED").map((session) => dayKey(session.date)),
  );
  dates.forEach((date, index) => {
    if (doneOn.has(date)) days[index].done = true;
  });
  return days;
}

export function TreinoScreen({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const today = todayInRecife();
  const [pulses, setPulses] = useState<Record<string, number>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const routines = useQuery({
    queryKey: ["routines", studentId],
    queryFn: () => api.routines(studentId),
  });
  const sessions = useQuery({
    queryKey: ["sessions", studentId],
    queryFn: () => api.sessions(studentId),
  });
  const routine = routines.data?.data[0];
  const sessionRows = sessions.data?.data ?? [];

  const session = useMutation({
    mutationFn: (trainingId: string) => {
      setPendingId(trainingId);
      setErrorId(null);
      return api.completeSession({
        studentId,
        trainingId,
        routineId: routine?.id,
        date: today,
      });
    },
    onSuccess: (_data, trainingId) => {
      setPulses((current) => ({ ...current, [trainingId]: (current[trainingId] ?? 0) + 1 }));
      void queryClient.invalidateQueries({ queryKey: ["routines", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["sessions", studentId] });
    },
    onError: (_error, trainingId) => setErrorId(trainingId),
    onSettled: () => setPendingId(null),
  });

  const days = buildDays(routine?.trainings ?? [], sessionRows, today);
  const doneToday = new Set(
    sessionRows
      .filter((row) => row.status === "COMPLETED" && dayKey(row.date) === today && row.trainingId)
      .map((row) => row.trainingId as string),
  );

  if (routines.isLoading) {
    return <Text style={styles.loading}>Carregando a rotina</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
      <WeekRail days={days} />
      {routines.isSuccess && !routine ? (
        <View style={styles.empty}>
          <MuscleMark group="Corpo" />
          <Text style={styles.emptyText}>
            A rotina ainda não foi atribuída. Os dias do treino aparecem nesta faixa.
          </Text>
        </View>
      ) : null}
      {routine ? <RoutineHeading routineName={routine.name} objective={routine.objective} done={routine.completedSessions} total={routine.totalSessions} frequency={routine.frequency} /> : null}
      {routine?.trainings.map((training, index) => (
        <Enter key={training.id} index={index}>
          <View style={styles.sheet}>
            <View style={styles.sheetHead}>
              <Text style={styles.code}>{training.code}</Text>
              <View style={styles.sheetCopy}>
                <Text style={styles.trainingName}>{training.name}</Text>
                <Text style={styles.meta}>
                  {[training.focus, training.dayOfWeek, training.duration].filter(Boolean).join(", ")}
                </Text>
              </View>
            </View>
            {training.exercises.map((exercise, exerciseIndex) => (
              <Enter key={`${training.id}-${exercise.name}-${exerciseIndex}`} index={exerciseIndex}>
                <ExerciseRow exercise={exercise} />
              </Enter>
            ))}
            <ConfirmButton
              label="Fiz hoje"
              confirmedLabel="Feito"
              confirmed={doneToday.has(training.id) || (pulses[training.id] ?? 0) > 0}
              pulse={pulses[training.id] ?? 0}
              loading={pendingId === training.id}
              onPress={() => session.mutate(training.id)}
            />
            {errorId === training.id ? (
              <Text style={styles.error}>Não foi possível registrar o treino.</Text>
            ) : null}
          </View>
        </Enter>
      ))}
    </ScrollView>
  );
}

function RoutineHeading({
  routineName,
  objective,
  done,
  total,
  frequency,
}: {
  routineName: string;
  objective: string | null;
  done: number | null;
  total: number | null;
  frequency: number;
}) {
  const count = total ? `${done ?? 0} de ${total} sessões` : `${done ?? 0} sessões`;
  return (
    <View style={styles.heading}>
      <Text style={styles.routine}>{routineName}</Text>
      {objective ? <Text style={styles.meta}>{objective}</Text> : null}
      <Text style={styles.meta}>
        {count}
        {frequency ? `, ${frequency} dias por semana` : ""}
      </Text>
    </View>
  );
}

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  const [broken, setBroken] = useState(false);
  const media = exercise.mediaUrl;
  const showImage = Boolean(media && RASTER.test(media) && !broken);

  return (
    <View style={styles.exercise}>
      {showImage ? (
        <Image
          source={{ uri: media }}
          style={styles.photo}
          contentFit="cover"
          accessibilityLabel={`Imagem de ${exercise.name}`}
          onError={() => setBroken(true)}
        />
      ) : (
        <MuscleMark group={exercise.group || "Corpo"} />
      )}
      <View style={styles.exerciseCopy}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.group}>{exercise.group}</Text>
        <View style={styles.figures}>
          <Text style={styles.figure}>
            {exercise.sets} × {exercise.reps}
          </Text>
          {exercise.load != null ? <Text style={styles.figure}>{exercise.load} kg</Text> : null}
          {exercise.rest ? <Text style={styles.figure}>{exercise.rest}</Text> : null}
        </View>
        {exercise.cadence ? <Text style={styles.meta}>Cadência {exercise.cadence}</Text> : null}
        {media && !showImage ? (
          <Text style={styles.link} onPress={() => Linking.openURL(media)}>
            Abrir mídia
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: space.xl, gap: space.md },
  loading: { fontFamily: font.body, color: colors.muted, padding: space.lg },
  heading: { paddingHorizontal: space.lg, gap: 2 },
  routine: { fontFamily: font.title, fontSize: 20, color: colors.ink },
  meta: { fontFamily: font.body, fontSize: 14, color: colors.muted, lineHeight: 20 },
  sheet: {
    marginHorizontal: space.lg,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.md,
    ...shadow.card,
  },
  sheetHead: { flexDirection: "row", gap: space.md, alignItems: "center" },
  sheetCopy: { flex: 1 },
  code: {
    minWidth: 44,
    overflow: "hidden",
    borderRadius: radius.button,
    backgroundColor: "rgba(0,32,96,0.07)",
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 44,
    color: colors.navy,
    textAlign: "center",
  },
  trainingName: { fontFamily: font.titleSoft, fontSize: 16, color: colors.ink },
  exercise: {
    flexDirection: "row",
    gap: space.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: space.sm,
  },
  exerciseCopy: { flex: 1, gap: 2 },
  exerciseName: { fontFamily: font.titleSoft, fontSize: 15, color: colors.ink },
  group: { fontFamily: font.body, fontSize: 12, color: colors.muted },
  figures: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  figure: {
    overflow: "hidden",
    borderRadius: radius.pill,
    backgroundColor: colors.input,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    fontFamily: font.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  photo: { width: 64, height: 80, borderRadius: radius.input, backgroundColor: colors.input },
  link: { fontFamily: font.bodyBold, color: colors.navy, marginTop: 4 },
  error: { fontFamily: font.body, color: colors.danger },
  empty: {
    marginHorizontal: space.lg,
    flexDirection: "row",
    gap: space.md,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    ...shadow.card,
  },
  emptyText: { flex: 1, fontFamily: font.body, fontSize: 15, color: colors.ink, lineHeight: 22 },
});
