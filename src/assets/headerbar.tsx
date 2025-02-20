function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'My home',
          }}
        />
      </Stack.Navigator>
    );
  }