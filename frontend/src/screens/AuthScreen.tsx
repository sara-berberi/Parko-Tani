import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../state/useAuth';

type FormValues = { name?: string; email: string; password: string };

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '', password: '', name: '' } });

  const onSubmit = async (values: FormValues) => {
    if (mode === 'login') {
      await login({ email: values.email, password: values.password });
    } else {
      await signup({ name: values.name || 'Driver', email: values.email, password: values.password });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {mode === 'login' ? 'Welcome back' : 'Create account'}
      </Text>

      {mode === 'signup' && (
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput label="Name" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />
      )}

      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Email" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: true, minLength: 6 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            value={value}
            secureTextEntry
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={styles.button}>
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <Button mode="text" onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});
