import React from "react";

import image from "./assets/Macaca_nigra_self-portrait_large.jpg";
import image100px from "./assets/Macaca_nigra_self-portrait_large.jpg?width=100";

function App() {
  return (
    <div>
      <img src={image} />
      <img src={image100px} />
    </div>
  );
}

export default App;
