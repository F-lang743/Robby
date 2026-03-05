import 'package:url_launcher/url_launcher.dart';
import 'package:logger/logger.dart';

/// Sends emails hands-free by composing a mailto: URI.
///
/// ## Efficiency notes
/// - Uses the OS mailto: scheme, which avoids bundling an SMTP library and
///   any credentials in the app binary.
/// - [canLaunchUrl] is called first to avoid a redundant OS handshake when
///   no email client is installed.
class EmailService {
  EmailService({Logger? logger})
      : _log = logger ?? Logger(printer: PrettyPrinter());

  final Logger _log;

  /// Open the device email client pre-filled with [to], [subject], and [body].
  ///
  /// Returns `true` if the email client was opened successfully.
  Future<bool> sendEmail({
    required String to,
    required String subject,
    required String body,
    List<String> cc = const [],
  }) async {
    final uri = _buildMailtoUri(
      to: to,
      subject: subject,
      body: body,
      cc: cc,
    );

    if (!await canLaunchUrl(uri)) {
      _log.w('EmailService: no email client available');
      return false;
    }

    final launched = await launchUrl(uri);
    if (launched) {
      _log.i('EmailService: email client opened for $to');
    } else {
      _log.e('EmailService: failed to open email client');
    }
    return launched;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  Uri _buildMailtoUri({
    required String to,
    required String subject,
    required String body,
    List<String> cc = const [],
  }) {
    final params = <String, String>{
      'subject': subject,
      'body': body,
      if (cc.isNotEmpty) 'cc': cc.join(','),
    };

    // Use Uri.https-style query encoding to safely escape special characters.
    return Uri(
      scheme: 'mailto',
      path: to,
      queryParameters: params,
    );
  }
}
