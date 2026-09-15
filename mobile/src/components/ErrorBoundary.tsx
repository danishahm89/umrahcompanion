import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/** Catches render/runtime errors anywhere below it and shows a readable
 * message instead of letting the whole app crash silently (release builds
 * have no red-box, so an uncaught error otherwise just closes the app). */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111' }}>
              Something went wrong
            </Text>
            <Text style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>
              Please close and reopen the app. If this keeps happening, share this message:
            </Text>
            <Text selectable style={{ fontSize: 12, color: '#900', fontFamily: 'monospace' }}>
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </Text>
          </View>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}
