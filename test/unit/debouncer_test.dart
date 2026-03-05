import 'package:flutter_test/flutter_test.dart';

import 'package:robby/core/utils/debouncer.dart';

void main() {
  group('Debouncer', () {
    test('fires after delay when called once', () async {
      var count = 0;
      final d = Debouncer(delay: const Duration(milliseconds: 50));
      d.run(() => count++);
      expect(count, 0); // should not have fired yet
      await Future<void>.delayed(const Duration(milliseconds: 100));
      expect(count, 1);
    });

    test('collapses multiple rapid calls into one', () async {
      var count = 0;
      final d = Debouncer(delay: const Duration(milliseconds: 50));
      for (var i = 0; i < 5; i++) {
        d.run(() => count++);
      }
      await Future<void>.delayed(const Duration(milliseconds: 100));
      expect(count, 1); // only the last call should fire
    });

    test('cancel prevents firing', () async {
      var count = 0;
      final d = Debouncer(delay: const Duration(milliseconds: 50));
      d.run(() => count++);
      d.cancel();
      await Future<void>.delayed(const Duration(milliseconds: 100));
      expect(count, 0);
    });

    test('isPending is true while timer is active', () async {
      final d = Debouncer(delay: const Duration(milliseconds: 100));
      expect(d.isPending, isFalse);
      d.run(() {});
      expect(d.isPending, isTrue);
      await Future<void>.delayed(const Duration(milliseconds: 150));
      expect(d.isPending, isFalse);
    });
  });

  group('Throttler', () {
    test('fires on first call', () {
      var count = 0;
      final t = Throttler(interval: const Duration(seconds: 10));
      final fired = t.call(() => count++);
      expect(fired, isTrue);
      expect(count, 1);
    });

    test('suppresses calls within the interval', () {
      var count = 0;
      final t = Throttler(interval: const Duration(seconds: 10));
      t.call(() => count++);
      t.call(() => count++); // suppressed
      t.call(() => count++); // suppressed
      expect(count, 1);
    });

    test('reset allows immediate re-fire', () {
      var count = 0;
      final t = Throttler(interval: const Duration(seconds: 10));
      t.call(() => count++);
      t.reset();
      t.call(() => count++); // should fire again after reset
      expect(count, 2);
    });
  });
}
