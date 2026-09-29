export default function SizeGuidePage() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Size guide</p>
        <h1>Find your fit.</h1>
      </div>

      <div className="article-copy">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid rgba(15,61,46,0.15)", padding: "10px 0" }}>Size</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid rgba(15,61,46,0.15)", padding: "10px 0" }}>Bust</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid rgba(15,61,46,0.15)", padding: "10px 0" }}>Waist</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid rgba(15,61,46,0.15)", padding: "10px 0" }}>Hip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px 0" }}>XS</td>
              <td>82 cm</td>
              <td>62 cm</td>
              <td>88 cm</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>S</td>
              <td>86 cm</td>
              <td>66 cm</td>
              <td>92 cm</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>M</td>
              <td>90 cm</td>
              <td>70 cm</td>
              <td>96 cm</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>L</td>
              <td>96 cm</td>
              <td>76 cm</td>
              <td>102 cm</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>XL</td>
              <td>102 cm</td>
              <td>82 cm</td>
              <td>108 cm</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
