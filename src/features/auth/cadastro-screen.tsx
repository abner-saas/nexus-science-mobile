import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { AuthMast } from "@/components/auth-mast";
import { Button, ErrorText, Field, Screen } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { refreshSession } from "@/lib/session";
import { colors, font, radius, shadow, space } from "@/theme";

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
    <Screen tone="navy">
      <ScrollView contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled" bounces={false}>
        <AuthMast />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.lead}>Depois você escolhe o plano e abre a fatura.</Text>
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
          <Pressable accessibilityRole="link" onPress={() => router.back()} style={styles.linkTarget}>
            <Text style={styles.link}>Já tenho conta</Text>
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
  lead: { fontFamily: font.body, fontSize: 16, color: colors.muted, marginTop: -space.sm, lineHeight: 22 },
  linkTarget: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  link: { fontFamily: font.bodyBold, color: colors.navy, fontSize: 15 },
});
