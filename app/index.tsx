import { Stack } from 'expo-router';
import { useState } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { ThemeToggle } from '~/components/ToggleTheme';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import * as FileSystem from 'expo-file-system';

export default function Home() {
  const [value, setValue] = useState('');

  async function createPlugin(name: string) {
    const plugins_dir = FileSystem.documentDirectory + 'plugins';
    const plugin_file = plugins_dir + `/${name}`;
    if (!(await FileSystem.getInfoAsync(plugins_dir)).exists) {
      await FileSystem.makeDirectoryAsync(plugins_dir);
    }

    await FileSystem.writeAsStringAsync(
      plugin_file,
      `export default function run(){ alert('hello from ${name}') }`
    );
  }

  async function runPlugins() {
    const plugins_dir = FileSystem.documentDirectory + 'plugins';
    for (const plugin of await FileSystem.readDirectoryAsync(plugins_dir)) {
      const code = await FileSystem.readAsStringAsync(plugins_dir + `/${plugin}`);
      const func = Function(
        'require',
        'module',
        `const exports = module.exports = {}; 
      ${code}; 
      return exports.default`
      );

      alert(func.toString());
    }
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
            <Button className="w-1/2" onPress={() => runPlugins()} variant={'default'}>
              <Text>Run Plugins</Text>
            </Button>
          </View>
          <View className="flex-row gap-2">
            <Button
              className="w-1/2"
              onPress={() => alert('deleteplugins')}
              variant={'destructive'}>
              <Text>Delete All Plugins</Text>
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
