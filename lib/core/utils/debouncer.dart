import 'dart:async';

/// Collapses multiple rapid calls into a single execution after [delay] has
/// elapsed without another call.
///
/// Used throughout the app to avoid hammering GPS or voice APIs on every tick.
class Debouncer {
  Debouncer({this.delay = const Duration(milliseconds: 300)});

  final Duration delay;
  Timer? _timer;

  void run(void Function() action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void cancel() {
    _timer?.cancel();
    _timer = null;
  }

  bool get isPending => _timer?.isActive ?? false;
}

/// Ensures [action] is called **at most once** per [interval].
///
/// Unlike [Debouncer], this fires immediately on the first call and then
/// suppresses subsequent calls until the interval elapses.  Useful for GPS
/// position updates where the first reading should be acted on right away.
class Throttler {
  Throttler({this.interval = const Duration(seconds: 5)});

  final Duration interval;
  DateTime? _lastRun;

  bool call(void Function() action) {
    final now = DateTime.now();
    if (_lastRun == null || now.difference(_lastRun!) >= interval) {
      _lastRun = now;
      action();
      return true;
    }
    return false;
  }

  void reset() => _lastRun = null;
}
