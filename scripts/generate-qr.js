import QRCode from 'qrcode';

const url = 'https://nicolas-cousin-tech-solutions.github.io/dotnet-modernization-overview/';
const outputPath = './docs/qr-code-presentation.png';

try {
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  console.log(`QR code generated successfully at ${outputPath}`);
} catch (err) {
  console.error('Error generating QR code:', err);
  process.exit(1);
}
