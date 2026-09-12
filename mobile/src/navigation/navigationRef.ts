import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends keyof RootStackParamList>(
  ...args: RootStackParamList[Name] extends undefined ? [Name] : [Name, RootStackParamList[Name]]
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error — navigate's overloads don't collapse nicely through a generic helper.
    navigationRef.navigate(...args);
  }
}
