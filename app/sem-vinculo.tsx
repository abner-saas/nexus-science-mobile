import { StyleSheet, Text, View } from "react-native";
import { BrandHeader, Button, Card, Screen } from "@/components/ui";
import { signOutToLogin } from "@/lib/sign-out";
import { colors, font, space } from "@/theme";

export default function SemVinculoRoute() {
  return (
    <Screen tone="navy">
      <BrandHeader title="Aluno" />
      <View style={styles.body}>
        <Card style={styles.panel}>
          <Text style={styles.title}>Conta sem ficha</Text>
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
  body: { flex: 1, backgroundColor: colors.background, padding: space.xl, gap: space.md },
  panel: { gap: space.md },
  title: { fontFamily: font.title, fontSize: 26, color: colors.ink },
  copy: { fontFamily: font.body, fontSize: 16, color: colors.muted, lineHeight: 24 },
});
