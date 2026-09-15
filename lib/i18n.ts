import { cookies } from "next/headers";

export type Locale = "en" | "id";

export interface HomeDict {
  title: string;
  subtitle: string;
  schoolAdmin: string;
  clubAdmin: string;
}

export interface LoginDict {
  schoolTitle: string;
  schoolSubtitle: string;
  clubTitle: string;
  clubSubtitle: string;
  email: string;
  password: string;
  show: string;
  hide: string;
  signIn: string;
  signingIn: string;
  back: string;
  tryClub: string;
  trySchool: string;
}

export interface SettingsDict {
  title: string;
  theme: string;
  light: string;
  dark: string;
  language: string;
  back: string;
}

export interface DashboardDict {
  schoolAdminLabel: string;
  clubAdminLabel: string;
  pendingTitle: string;
  pendingDesc: string;
  classroomsTitle: string;
  classroomsDescSchool: string;
  classroomsDescClub: string;
  clubsTitle: string;
  clubsDesc: string;
  myRequestsTitle: string;
  myRequestsDesc: string;
  responsesTitle: string;
  responsesDesc: string;
  settingsLabel: string;
  signOut: string;
}

interface Dictionary {
  home: HomeDict;
  login: LoginDict;
  settings: SettingsDict;
  dashboard: DashboardDict;
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    home: {
      title: "School Class Booking",
      subtitle:
        "Request classrooms for your club, and let school administrators review, approve, or reject them.",
      schoolAdmin: "School Admin",
      clubAdmin: "Club Admin",
    },
    login: {
      schoolTitle: "School Admin Login",
      schoolSubtitle: "Enter your credentials to access the admin panel",
      clubTitle: "Club Admin Login",
      clubSubtitle: "Enter your credentials to manage your club's bookings",
      email: "Email",
      password: "Password",
      show: "Show",
      hide: "Hide",
      signIn: "Sign in",
      signingIn: "Signing in...",
      back: "← Back",
      tryClub: "Try logging in as Club Admin",
      trySchool: "Try logging in as School Admin",
    },
    settings: {
      title: "Settings",
      theme: "Appearance",
      light: "Light",
      dark: "Dark",
      language: "Language",
      back: "← Dashboard",
    },
    dashboard: {
      schoolAdminLabel: "School Admin",
      clubAdminLabel: "Club Admin",
      pendingTitle: "Pending requests",
      pendingDesc: "Review, accept, or reject classroom requests",
      classroomsTitle: "Classrooms",
      classroomsDescSchool: "View classroom list and availability",
      classroomsDescClub: "Check availability and pick rooms",
      clubsTitle: "Clubs",
      clubsDesc: "View registered clubs",
      myRequestsTitle: "My requests",
      myRequestsDesc: "Create, edit, or cancel requests",
      responsesTitle: "Responses",
      responsesDesc: "View accepted or rejected requests",
      settingsLabel: "Settings",
      signOut: "Sign out",
    },
  },
  id: {
    home: {
      title: "Pemesanan Kelas Sekolah",
      subtitle:
        "Ajukan ruang kelas untuk klub kamu, dan biarkan admin sekolah meninjau, menyetujui, atau menolaknya.",
      schoolAdmin: "Admin Sekolah",
      clubAdmin: "Admin Klub",
    },
    login: {
      schoolTitle: "Login Admin Sekolah",
      schoolSubtitle: "Masukkan kredensial untuk mengakses panel admin",
      clubTitle: "Login Admin Klub",
      clubSubtitle: "Masukkan kredensial untuk mengelola pemesanan klub kamu",
      email: "Email",
      password: "Kata Sandi",
      show: "Tampilkan",
      hide: "Sembunyikan",
      signIn: "Masuk",
      signingIn: "Sedang masuk...",
      back: "← Kembali",
      tryClub: "Coba masuk sebagai Admin Klub",
      trySchool: "Coba masuk sebagai Admin Sekolah",
    },
    settings: {
      title: "Pengaturan",
      theme: "Tampilan",
      light: "Terang",
      dark: "Gelap",
      language: "Bahasa",
      back: "← Dasbor",
    },
    dashboard: {
      schoolAdminLabel: "Admin Sekolah",
      clubAdminLabel: "Admin Klub",
      pendingTitle: "Permintaan tertunda",
      pendingDesc: "Tinjau, setujui, atau tolak permintaan ruang kelas",
      classroomsTitle: "Ruang Kelas",
      classroomsDescSchool: "Lihat daftar ruang kelas dan ketersediaannya",
      classroomsDescClub: "Cek ketersediaan dan pilih ruangan",
      clubsTitle: "Klub",
      clubsDesc: "Lihat klub terdaftar",
      myRequestsTitle: "Permintaan saya",
      myRequestsDesc: "Buat, ubah, atau batalkan permintaan",
      responsesTitle: "Tanggapan",
      responsesDesc: "Lihat permintaan yang diterima atau ditolak",
      settingsLabel: "Pengaturan",
      signOut: "Keluar",
    },
  },
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "id" ? "id" : "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
