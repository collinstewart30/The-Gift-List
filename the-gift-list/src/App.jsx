import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://spjzdxkzldkxetwmtiln.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwanpkeGt6bGRreGV0d210aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NTM2MTEsImV4cCI6MjA1MDMyOTYxMX0.8d2GaPhgmwgiYlw4R6UsLfUFdDaFUMymOX36lLr4k5c");

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default App;