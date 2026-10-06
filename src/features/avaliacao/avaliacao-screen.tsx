import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Empty } from "@/components/ui";
import { api } from "@/lib/api";
import { colors, space } from "@/theme";

export function AvaliacaoScreen({ studentId }: { studentId: string }) {
  const assessments = useQuery({
    queryKey: ["assessments", studentId],
    queryFn: () => api.assessments(studentId),
  });
  const rows = assessments.data?.data ?? [];

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {assessments.isSuccess && rows.length === 0 ? <Empty text="Sem avaliações ainda." /> : null}
      {rows.map((row) => {
        const photos = row.photoUrls ?? [];
        return (
          <Card key={row.id}>
            <Text style={styles.date}>{row.date}</Text>
            <Text style={styles.metric}>Peso {row.weight ?? "—"} kg</Text>
            <Text style={styles.metric}>IMC {row.bmi ?? "—"}</Text>
            <Text style={styles.metric}>Gordura {row.bodyFat ?? "—"}%</Text>
            <Text style={styles.metric}>Músculo {row.muscle ?? "—"}%</Text>
            {photos.length === 0 ? <Empty text="Sem fotos nesta avaliação." /> : null}
            <View style={styles.photos}>
              {photos.map((url) => (
                <Image key={url} source={{ uri: url }} style={styles.photo} contentFit="cover" />
              ))}
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.md },
  date: { color: colors.navy, fontWeight: "700", marginBottom: space.sm },
  metric: { color: colors.ink, fontSize: 15, marginBottom: 2 },
  photos: { flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.sm },
  photo: { width: 96, height: 128, borderRadius: 10, backgroundColor: colors.input },
});
