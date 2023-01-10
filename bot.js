// Persiapkan dependencies
const { Client, File, LocalAuth } = require('whatsapp-web.js');
const fetch = require('isomorphic-fetch');
const qrcode = require('qrcode-terminal');

// Buat client WhatsApp
const client = new Client({
  auth: new LocalAuth(),
});

// Persiapkan event handler untuk menerima pesan
client.on('message', (msg) => {
  // Cek apakah pesan yang diterima adalah perintah !price
  if (msg.body.startsWith('!price')) {
    // Ambil nama aset yang diminta
    const asset = msg.body.split(' ')[1];

    // Ambil data harga akhir aset dari Yahoo Finance
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${asset}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) { // Jika API Yahoo Finance mengembalikan error
          client.sendMessage(msg.from, 'Aset tidak ditemukan.'); // Kirim pesan error ke client
        } else { // Jika tidak ada error
        // Ambil harga akhir aset dari data yang didapat dari API
        const price = data.chart.result[0].meta.regularMarketPrice;
        const exchange = data.chart.result[0].meta.exchangeName;
        const instrumentType = data.chart.result[0].meta.instrumentType;
        // Kirim pesan balik ke pengirim dengan harga akhir aset yang diminta
        client.sendMessage(msg.from, `Aset: ${asset} \nHarga akhir: ${price} \n Exchange: ${exchange} \n Instrument Type: ${instrumentType} \n *WHANGSAFF BOT US STOCKS PRICE SCANNER*`);
        }
        })
        .catch((error) => { // Jika terjadi error saat mengakses API Yahoo Finance
        client.sendMessage(msg.from, 'Terjadi error saat mengambil data.'); // Kirim pesan error ke client
        });
        }
        });
// Event handler untuk melihat status koneksi
client.on('authenticated', (session) => {
    console.log(`[${new Date().toLocaleString()}] Authenticated successfully with session:`);
    console.log(session);
  });
  
  client.on('auth_failure', (msg) => {
    console.log(`[${new Date().toLocaleString()}] Auth failure: ${msg}`);
  });
  
  client.on('ready', () => {
    console.log(`[${new Date().toLocaleString()}] Ready.`);
  });
        // Tampilkan QR code di terminal saat client dimulai
        client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        });

        // Mulai client
        client.initialize();