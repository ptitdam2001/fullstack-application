import "./App.css";
import { PrimaryButton } from "@Common/components";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <SnackbarProvider>
      <h1 className="text-3xl font-bold underline">
        Hello world!
        <PrimaryButton>Coucou</PrimaryButton>
      </h1>
    </SnackbarProvider>
  );
}

export default App;
