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
    try {
      const plugins_dir = FileSystem.documentDirectory + 'plugins';
      const plugin_file = plugins_dir + `/${name}`;
      await FileSystem.makeDirectoryAsync(plugins_dir + `/${name}`, { intermediates: true });

      const code = await fetch(
        'https://raw.githubusercontent.com/ivanleopoldo/expo-plugin-system-demo/refs/heads/main/plugins/example.plugin.js',
        {
          headers: { pragma: 'no-cache', 'cache-control': 'no-cache' },
        }
      ).then((res) => res.text());

      await FileSystem.writeAsStringAsync(plugin_file + '/index.js', code);
    } catch (err) {
      console.error(err);
    }
  }

  async function runPlugins() {
    try {
      const plugins_dir = FileSystem.documentDirectory + 'plugins';

      for (const plugin of await FileSystem.readDirectoryAsync(plugins_dir)) {
        const code = await FileSystem.readAsStringAsync(plugins_dir + `/${plugin}` + '/index.js');
        const module = { exports: {} };
        const func = new Function('module', code);

        func(module);

        if (typeof module.exports === 'function') {
          module.exports(plugin);
        } else {
          console.warn(`No function exported from ${plugin}/index.js`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deletePlugins() {
    const plugins_dir = FileSystem.documentDirectory + 'plugins';
    await FileSystem.deleteAsync(plugins_dir);
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
            <Button className="w-1/2" onPress={() => deletePlugins()} variant={'destructive'}>
              <Text>Delete All Plugins</Text>
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
