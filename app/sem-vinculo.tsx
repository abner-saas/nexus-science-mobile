import { StyleSheet, Text, View } from "react-native";
import { Button, Card, Screen } from "@/components/ui";
import { signOutToLogin } from "@/lib/sign-out";
import { colors, space } from "@/theme";

export default function SemVinculoRoute() {
  return (
    <Screen>
      <View style={styles.body}>
        <Card>
          <Text style={styles.title}>Conta sem aluno vinculado</Text>
          <Text style={styles.copy}>
            Seu login é de aluno, mas ainda não está ligado a uma ficha. Fale com a consultoria.
          </Text>
          <Button label="Sair" onPress={signOutToLogin} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: "center", padding: space.xl },
  title: { color: colors.navy, fontSize: 22, fontWeight: "700", marginBottom: space.sm },
  copy: { color: colors.muted, fontSize: 15, marginBottom: space.lg },
});
