"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeButtonProps = {
  text?: boolean;
};

const ThemeButton = ({ text = false }: ThemeButtonProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (text) {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex items-center space-x-2"
      >
        <span>
          <span>
            {resolvedTheme === "light" && <Moon size={18} />}
            {resolvedTheme === "dark" && <Sun size={18} />}
          </span>
        </span>
        <span className="text-standard font-medium">
          {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "light" && <Moon size={18} />}
      {resolvedTheme === "dark" && <Sun size={18} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeButton;
