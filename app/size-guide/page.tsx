import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Size guide | RTW by Elegant Moi",
  description: "UK / Nigerian dress sizes with bust, waist and hip measurements in centimetres and inches.",
};

// UK sizing, as used in Nigeria. Measurements are body measurements, not garment measurements.
const SIZES = [
  { uk: "6", us: "2", eu: "34", bust: 78, waist: 60, hip: 86 },
  { uk: "8", us: "4", eu: "36", bust: 82, waist: 64, hip: 90 },
  { uk: "10", us: "6", eu: "38", bust: 86, waist: 68, hip: 94 },
  { uk: "12", us: "8", eu: "40", bust: 90, waist: 72, hip: 98 },
  { uk: "14", us: "10", eu: "42", bust: 95, waist: 77, hip: 103 },
  { uk: "16", us: "12", eu: "44", bust: 100, waist: 82, hip: 108 },
  { uk: "18", us: "14", eu: "46", bust: 105, waist: 87, hip: 113 },
  { uk: "20", us: "16", eu: "48", bust: 110, waist: 92, hip: 118 },
  { uk: "22", us: "18", eu: "50", bust: 115, waist: 97, hip: 123 },
  { uk: "24", us: "20", eu: "52", bust: 120, waist: 102, hip: 128 },
  { uk: "26", us: "22", eu: "54", bust: 125, waist: 107, hip: 133 },
];

const inch = (cm: number) => Math.round(cm / 2.54);

export default function SizeGuidePage() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Size guide</p>
        <h1>Find your fit.</h1>
        <p>We use UK sizes, the sizes used across Nigeria (6, 8, 10, 12, 14 and so on). Measure your body and choose the size closest to your bust, waist and hip.</p>
      </div>

      <div className="size-guide">
        <div className="size-table-wrap">
          <table className="size-table">
            <thead>
              <tr>
                <th>UK / Nigeria</th>
                <th>US</th>
                <th>EU</th>
                <th>Bust</th>
                <th>Waist</th>
                <th>Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size.uk}>
                  <td><b>{size.uk}</b></td>
                  <td>{size.us}</td>
                  <td>{size.eu}</td>
                  <td>{size.bust} cm <small>{inch(size.bust)}″</small></td>
                  <td>{size.waist} cm <small>{inch(size.waist)}″</small></td>
                  <td>{size.hip} cm <small>{inch(size.hip)}″</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="size-tips">
          <div><h3>Bust</h3><p>Measure around the fullest part of your chest, keeping the tape level.</p></div>
          <div><h3>Waist</h3><p>Measure around your natural waist, the narrowest part of your body.</p></div>
          <div><h3>Hip</h3><p>Stand with your feet together and measure around the fullest part of your hips.</p></div>
          <div><h3>Between sizes?</h3><p>Choose the larger size, or <Link href="/contact">message us</Link> your measurements and we will recommend the best fit for that piece.</p></div>
        </div>
      </div>
    </div>
  );
}
