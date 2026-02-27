import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useThemeCustom } from "@/context/ThemeContext";

dayjs.extend(customParseFormat);

const parseDate = (str: string) => {
  if (!str) return null;
  let d = dayjs(str);
  if (d.isValid()) return d;
  d = dayjs(str, "DD-MM-YYYY");
  return d.isValid() ? d : null;
};

interface DateSelectorProps {
  label: string;
  value?: string;
  onChange?: (selected: string) => void;
  error?: string;
}

export default function DateSelector({ label, value, onChange }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = React.useState<any>(
    value ? parseDate(value) : null
  );
  const { dark } = useThemeCustom();

  React.useEffect(() => {
    setSelectedDate(value ? parseDate(value) : null);
  }, [value]);

  const handleChange = (newValue: any) => {
    setSelectedDate(newValue);
    onChange?.(newValue ? newValue.format("DD-MM-YYYY") : "");
  };

  const hasValue = Boolean(value);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl sx={{ width: "100%", minWidth: { md: 170 } }}>

        {/* Label above — matching ObjectSelect/SingleSelect */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#94A3B8",
            marginBottom: "6px",
            marginLeft: "2px",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {label}
        </p>

        <DatePicker
          value={selectedDate}
          onChange={handleChange}
          format="DD-MM-YYYY"
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              label: undefined, // hide MUI label — we use our own above
              placeholder: `Select ${label}…`,
              InputLabelProps: { shrink: false },
              sx: (theme) => ({
                fontFamily: "inherit",

                // Input root — match h-11 + rounded-lg + left-border-4 style
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                  paddingLeft: "16px",
                  paddingRight: "8px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  fontWeight: hasValue ? 600 : 400,
                  backgroundColor: hasValue ? "var(--color-primary-lighter)" : "#F8FAFC",
                  color: hasValue ? "#1E293B" : "#94A3B8",
                  borderLeft: `4px solid ${hasValue ? "var(--color-primary)" : "#E2E8F0"}`,
                  transition: "all 0.2s",
                  boxShadow: "none",
                },

                // Remove default MUI outline and replace with none (border-left handles it)
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                // Focused state
                "& .MuiInputBase-root.Mui-focused": {
                  backgroundColor: "var(--color-primary-lighter)",
                  borderLeft: `4px solid var(--color-primary)`,
                  boxShadow: "0 4px 12px color-mix(in srgb, var(--color-primary) 10%, transparent)",
                },

                // Calendar icon
                "& .MuiSvgIcon-root": {
                  color: hasValue ? "var(--color-primary)" : "#94A3B8",
                  fontSize: "18px",
                },

                // Dark mode
                ...(dark && {
                  [theme.breakpoints.down("sm")]: {
                    "& .MuiInputBase-root": {
                      backgroundColor: hasValue
                        ? "color-mix(in srgb, var(--color-primary) 12%, transparent)"
                        : "var(--color-childbgdark)",
                      color: hasValue ? "#E2E8F0" : "#475569",
                      borderLeft: `4px solid ${hasValue ? "var(--color-primary)" : "#334155"}`,
                    },
                    "& .MuiInputBase-root.Mui-focused": {
                      backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                      borderLeft: `4px solid var(--color-primary)`,
                    },
                    "& .MuiSvgIcon-root": {
                      color: hasValue ? "var(--color-primary)" : "#475569",
                    },
                  },
                }),
              }),
            },
          }}
          enableAccessibleFieldDOMStructure={false}
        />
      </FormControl>
    </LocalizationProvider>
  );
}