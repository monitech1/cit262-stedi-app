import React from 'react';
import { Button, View, Text } from 'react-native';

function Login() {
  const handleClick = () => {
    alert('Hello Monigan'); 
  };

  return (
    <View>
      <Button title="Click Me" onPress={handleClick} />
    </View>
  );
}

export default Login;
