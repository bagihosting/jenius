# Cara Instalasi Aplikasi Ayah Jenius di AlmaLinux 8

Tutorial ini akan memandu Anda melalui proses instalasi dan deployment aplikasi Next.js Ayah Jenius di server yang menjalankan AlmaLinux 8.

## 1. Prasyarat

- Server dengan AlmaLinux 8 terinstal.
- Akses root atau pengguna dengan hak `sudo`.
- Domain atau subdomain yang sudah diarahkan ke IP server Anda (opsional, untuk produksi).

## 2. Persiapan Server

Pertama, pastikan sistem Anda terbarui. Buka terminal dan jalankan perintah berikut:

```bash
sudo dnf update -y
```

Selanjutnya, instal `git` untuk mengambil kode sumber dari repositori.

```bash
sudo dnf install git -y
```

## 3. Instalasi Node.js

Aplikasi ini membutuhkan Node.js. Kami merekomendasikan menggunakan Node.js versi 20.x. Cara termudah untuk menginstalnya adalah melalui repositori NodeSource.

```bash
# Tambahkan repositori NodeSource untuk Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo -E bash -

# Instal Node.js dan build tools yang diperlukan
sudo dnf install nodejs -y
```

Verifikasi instalasi dengan memeriksa versi Node.js dan npm:

```bash
node -v
# Seharusnya menampilkan v20.x.x

npm -v
# Seharusnya menampilkan versi npm yang sesuai
```

## 4. Mendapatkan Kode Aplikasi

Kloning repositori proyek ke direktori yang Anda inginkan (misalnya, `/var/www/ayah-jenius`).

```bash
# Ganti <URL_REPOSITORI_ANDA> dengan URL Git proyek Anda yang sebenarnya
git clone <URL_REPOSITORI_ANDA> /var/www/ayah-jenius

# Pindah ke direktori proyek
cd /var/www/ayah-jenius
```

## 5. Konfigurasi Lingkungan

Aplikasi ini memerlukan variabel lingkungan (environment variables) untuk terhubung ke layanan Firebase. Buat file `.env` dari file `.env.example` (jika ada) atau buat file baru.

```bash
# Salin dari example jika ada, atau buat file baru
# cp .env.example .env

# Jika tidak ada .env.example, buat file baru
touch .env
```

Buka file `.env` dengan editor teks favorit Anda (misalnya, `nano`):

```bash
nano .env
```

Isi file tersebut dengan kredensial Firebase Anda. Ini adalah langkah **KRUSIAL**.

```env
# Kredensial Firebase dari konsol Firebase Anda
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="proyek-anda.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="proyek-anda"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="proyek-anda.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://proyek-anda-default-rtdb.firebaseio.com"

# Variabel lain (jika ada)
# ...
```

Simpan file dan keluar dari editor (di `nano`, tekan `Ctrl+X`, lalu `Y`, lalu `Enter`).

## 6. Instalasi Dependensi & Build Aplikasi

Sekarang instal semua paket yang dibutuhkan oleh aplikasi:

```bash
npm install
```

Setelah instalasi selesai, buat versi produksi dari aplikasi:

```bash
npm run build
```

Perintah ini akan mengoptimalkan aplikasi untuk performa terbaik.

## 7. Menjalankan Aplikasi di Latar Belakang (Produksi)

Untuk lingkungan produksi, sangat disarankan menggunakan manajer proses seperti **PM2**. PM2 akan menjaga aplikasi Anda tetap berjalan, me-restartnya jika crash, dan mengelola log secara otomatis.

### Langkah 1: Instal PM2
Instal PM2 secara global menggunakan npm:
```bash
sudo npm install pm2 -g
```

### Langkah 2: Jalankan Aplikasi dengan PM2
Gunakan PM2 untuk menjalankan perintah `npm start` dari aplikasi Anda. Ini akan menjalankan aplikasi di latar belakang.
```bash
# Jalankan aplikasi dan beri nama "ayah-jenius"
pm2 start npm --name "ayah-jenius" -- start
```
Aplikasi Anda sekarang berjalan di port 3000.

### Langkah 3: Atur PM2 agar Berjalan saat Booting
Agar aplikasi otomatis berjalan kembali setelah server di-restart, atur PM2 untuk berjalan saat startup.
```bash
pm2 startup
```
Salin dan jalankan perintah yang ditampilkan oleh output `pm2 startup`. Ini biasanya terlihat seperti: `sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <username> --hp /home/<username>`

### Langkah 4: Simpan Konfigurasi
Simpan daftar proses PM2 Anda saat ini agar dapat dipulihkan saat booting.
```bash
pm2 save
```

### Perintah PM2 yang Berguna
- **Memonitor aplikasi**: `pm2 status` atau `pm2 monit`
- **Melihat log aplikasi**: `pm2 logs ayah-jenius`
- **Me-restart aplikasi**: `pm2 restart ayah-jenius`
- **Menghentikan aplikasi**: `pm2 stop ayah-jenius`

## Selesai!

Aplikasi Ayah Jenius Anda sekarang sudah berjalan secara andal di latar belakang pada server AlmaLinux 8. Untuk membuatnya dapat diakses melalui domain (misalnya `https://app.ayahjenius.com`), langkah selanjutnya adalah mengkonfigurasi *reverse proxy* menggunakan Nginx atau Apache.
