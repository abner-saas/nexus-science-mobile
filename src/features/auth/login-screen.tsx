import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, ErrorText, Field, Screen } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { refreshSession } from "@/lib/session";
import { colors, space } from "@/theme";

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
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <View style={styles.body}>
          <Text style={styles.brand}>Nexus Science</Text>
          <Text style={styles.lead}>Entre para ver treino, bio e pagamentos.</Text>
          <Card>
            <View style={styles.form}>
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
              <Button
                label="Continuar com Google (em breve)"
                onPress={() => undefined}
                disabled
                variant="ghost"
              />
            </View>
          </Card>
          <Pressable onPress={() => router.push("/(auth)/cadastro")}>
            <Text style={styles.link}>Ainda não tenho conta</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { flex: 1, justifyContent: "center", padding: space.xl, gap: space.lg },
  brand: { color: colors.navy, fontSize: 32, fontWeight: "700" },
  lead: { color: colors.muted, fontSize: 16, marginTop: -space.sm },
  form: { gap: space.md },
  link: { color: colors.maroon, textAlign: "center", fontWeight: "700" },
});
