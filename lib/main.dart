import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/cache/cache_service.dart';
import 'ui/screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialise cache before the widget tree is built.
  await CacheService.instance.init();

  runApp(
    // ProviderScope is the root for Riverpod state management.
    const ProviderScope(
      child: RobbyApp(),
    ),
  );
}

class RobbyApp extends StatelessWidget {
  const RobbyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Robby',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(useMaterial3: true).copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E88E5),
          brightness: Brightness.dark,
        ),
        // Large touch targets reduce driver distraction.
        iconTheme: const IconThemeData(size: 36),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontSize: 20),
          bodyMedium: TextStyle(fontSize: 18),
          titleLarge: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
