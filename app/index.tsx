import { Stack } from 'expo-router';
import { useState } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { ThemeToggle } from '~/components/ToggleTheme';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

export default function Home() {
  const [value, setValue] = useState('');

  function createPlugin(name: string) {
    alert(name);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerRight: () => <ThemeToggle /> }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="min-h-full w-full items-center justify-center gap-4">
          <View className="flex-row gap-2">
            <Input
              placeholder="Plugin Name"
              onChangeText={(text) => setValue(text)}
              className="w-1/2"
              value={value}
            />
            <Button
              onPress={(_) => {
                if (value !== '') {
                  createPlugin(value);
                  setValue('');
                }
              }}
              variant={'secondary'}>
              <Text>+</Text>
            </Button>
          </View>
          <View className="flex-row gap-2">
            <Button className="w-1/2" onPress={() => alert('run')} variant={'default'}>
              <Text>Run Plugins</Text>
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
