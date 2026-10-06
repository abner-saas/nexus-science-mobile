import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, ErrorText, Field, Screen } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { refreshSession } from "@/lib/session";
import { colors, space } from "@/theme";

export function CadastroScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    if (name.trim().length < 2) {
      setError("Informe seu nome.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (result.error) {
        setError(result.error.message ?? "Não foi possível criar a conta");
        return;
      }
      await refreshSession();
      router.replace("/");
    } catch {
      setError("Não foi possível criar a conta. Confira a conexão com a API.");
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
          <Text style={styles.brand}>Criar conta</Text>
          <Text style={styles.lead}>Depois você escolhe o plano e paga a fatura.</Text>
          <Card>
            <View style={styles.form}>
              <Field label="Nome" value={name} onChangeText={setName} autoCapitalize="words" />
              <Field
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
              />
              <Field
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
              <ErrorText text={error} />
              <Button label="Cadastrar" onPress={submit} loading={loading} />
            </View>
          </Card>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Já tenho conta</Text>
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
