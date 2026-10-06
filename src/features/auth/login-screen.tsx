import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { AuthMast } from "@/components/auth-mast";
import { Button, ErrorText, Field, Screen } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { refreshSession } from "@/lib/session";
import { colors, font, radius, shadow, space } from "@/theme";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });
      if (result.error) {
        setError(result.error.message ?? "E-mail ou senha inválidos");
        return;
      }
      await refreshSession();
      router.replace("/");
    } catch {
      setError("Não foi possível entrar. Confira a conexão com a API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen tone="navy">
      <ScrollView contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled" bounces={false}>
        <AuthMast />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.lead}>Treino, medidas e cobrança.</Text>
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
          />
          <ErrorText text={error} />
          <Button label="Entrar" onPress={submit} loading={loading} />
          <Button label="Continuar com Google (em breve)" onPress={() => undefined} disabled variant="ghost" />
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push("/(auth)/cadastro")}
            style={styles.linkTarget}
          >
            <Text style={styles.link}>Criar conta</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grow: { flexGrow: 1 },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
    padding: space.xl,
    paddingBottom: 40,
    gap: space.md,
    ...shadow.card,
  },
  title: { fontFamily: font.title, fontSize: 28, color: colors.ink },
  lead: { fontFamily: font.body, fontSize: 16, color: colors.muted, marginTop: -space.sm },
  linkTarget: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  link: { fontFamily: font.bodyBold, color: colors.navy, fontSize: 15 },
});
