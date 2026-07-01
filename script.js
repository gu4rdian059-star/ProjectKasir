// ===== DATA BARANG =====
const daftarBarang = [
    { nama: "Buku Tulis", harga: 25000, max: 10 },
    { nama: "Pensil 2B", harga: 30000, max: 15 },
    { nama: "Pulpen", harga: 40000, max: 15 },
    { nama: "Penghapus", harga: 15000, max: 10 },
    { nama: "Penggaris 30cm", harga: 50000, max: 10 },
    { nama: "Tas Sekolah", harga: 150000, max: 3 },
    { nama: "Tempat Pensil", harga: 25000, max: 5 },
    { nama: "Buku Gambar A3", harga: 85000, max: 10 },
    { nama: "Pensil Warna 12", harga: 250000, max: 5 },
    { nama: "Kalkulator", harga: 120000, max: 3 },
];

let data = [];
let namaKasir = "";
let totalBelanja = 0;

// ===== DOM =====
const selectBarang = document.getElementById("selectBarang");
const hargaOtomatis = document.getElementById("hargaOtomatis");
const jumlahInput = document.getElementById("jumlah");
const list = document.getElementById("list");
const kosongText = document.getElementById("kosong");

const subtotalText = document.getElementById("subtotalText");
const diskonText = document.getElementById("diskonText");
const ppnText = document.getElementById("ppnText");
const totalText = document.getElementById("totalText");
const discountNote = document.getElementById("discountNote");
const estimasiSubtotal = document.getElementById("estimasiSubtotal");

const namaKasirDisplay = document.getElementById("namaKasirDisplay");
const jamDisplay = document.getElementById("jamDisplay");

// ===== ISI DROPDOWN BARANG =====
daftarBarang.forEach((item, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = item.nama + " - " + rupiah(item.harga);
    selectBarang.appendChild(opt);
});

// Saat pilih barang, otomatis isi harga dan batasan JUMLAH
selectBarang.addEventListener("change", function () {
    jumlahInput.innerHTML = ""; // Kosongkan dulu

    if (this.value === "") {
        hargaOtomatis.value = "";
        const opt = document.createElement("option");
        opt.value = 1;
        opt.textContent = "1";
        jumlahInput.appendChild(opt);
    } else {
        const barang = daftarBarang[this.value];
        hargaOtomatis.value = rupiah(barang.harga);

        // Isi dropdown jumlah sesuai batas (max)
        for (let i = 1; i <= barang.max; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = i;
            jumlahInput.appendChild(opt);
        }
    }
    updateEstimasi();
});

jumlahInput.addEventListener("change", updateEstimasi);

function updateEstimasi() {
    if (selectBarang.value === "") {
        estimasiSubtotal.value = "Rp 0";
        return;
    }
    const barang = daftarBarang[selectBarang.value];
    const jumlah = parseInt(jumlahInput.value);
    estimasiSubtotal.value = rupiah(barang.harga * jumlah);
}

// ===== MODAL KASIR =====
function mulaiSesi(nama) {
    namaKasir = nama;
    namaKasirDisplay.textContent = namaKasir;
    document.getElementById("modalKasir").classList.add("hidden");
}

// ===== JAM =====
function updateJam() {
    const now = new Date();
    jamDisplay.textContent = now.toLocaleTimeString("id-ID");
}
setInterval(updateJam, 1000);
updateJam();

// ===== FORMAT RUPIAH =====
function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// ===== TAMBAH BARANG =====
function tambahBarang() {
    if (selectBarang.value === "") {
        alert("Pilih barang dulu!");
        return;
    }

    const barang = daftarBarang[selectBarang.value];
    const jumlah = parseInt(jumlahInput.value);

    if (!jumlah || jumlah <= 0) {
        alert("Jumlah harus lebih dari 0!");
        return;
    }

    // Cek apakah sudah ada di keranjang
    const ada = data.find(d => d.nama === barang.nama);
    if (ada) {
        ada.jumlah += jumlah;
        ada.subtotal = ada.harga * ada.jumlah;
    } else {
        data.push({
            nama: barang.nama,
            harga: barang.harga,
            jumlah: jumlah,
            subtotal: barang.harga * jumlah
        });
    }

    // Reset form
    selectBarang.value = "";
    hargaOtomatis.value = "";
    jumlahInput.value = 1;
    tampilkan();
}

// ===== TAMPILKAN DATA =====
function tampilkan() {
    list.innerHTML = "";
    let total = 0;

    if (data.length === 0) {
        kosongText.style.display = "block";
    } else {
        kosongText.style.display = "none";
    }

    data.forEach((item, index) => {
        total += item.subtotal;
        list.innerHTML += `
        <tr>
            <td>${item.nama}</td>
            <td>${rupiah(item.harga)}</td>
            <td>${item.jumlah}</td>
            <td>${rupiah(item.subtotal)}</td>
            <td><button onclick="hapus(${index})">Hapus</button></td>
        </tr>`;
    });

    let diskon = total > 100000 ? total * 0.1 : 0;
    let ppn = (total - diskon) * 0.11;
    let totalAkhir = total - diskon + ppn;

    subtotalText.textContent = rupiah(total);
    diskonText.textContent = rupiah(diskon);
    ppnText.textContent = rupiah(ppn);
    totalText.textContent = rupiah(totalAkhir);
    totalBelanja = totalAkhir;

    // Reset hitungan kembalian jika total berubah
    const uangBayar = document.getElementById("uangBayar");
    const kembalianText = document.getElementById("kembalianText");
    if (uangBayar) uangBayar.value = "";
    if (kembalianText) kembalianText.textContent = "Rp 0";

    if (diskon > 0) {
        discountNote.textContent = "✅ Diskon 10% aktif!";
        discountNote.style.color = "green";
    } else {
        discountNote.textContent = "*Diskon 10% untuk belanja di atas Rp 100.000";
        discountNote.style.color = "#999";
    }
}

// ===== HAPUS =====
function hapus(index) {
    data.splice(index, 1);
    tampilkan();
}

// ===== RESET =====
function resetData() {
    if (data.length === 0) return;
    if (confirm("Yakin ingin reset?")) {
        data = [];
        tampilkan();
    }
}

// ===== CETAK STRUK =====
function cetakStruk() {
    if (data.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    const waktu = now.toLocaleTimeString("id-ID");
    const noTrx = "TRX-" + Date.now().toString().slice(-8);
    const metodeBayar = document.querySelector('input[name="metodeBayar"]:checked').value;
    const bayar = parseInt(document.getElementById("uangBayar").value) || totalBelanja;
    const kembalian = bayar - totalBelanja;

    let total = 0;
    data.forEach(item => total += item.subtotal);
    let diskon = total > 100000 ? total * 0.1 : 0;
    let ppn = (total - diskon) * 0.11;
    let totalAkhir = total - diskon + ppn;

    let items = data.map(item =>
        `<tr>
            <td>${item.nama}</td>
            <td style="text-align:center">${item.jumlah}</td>
            <td style="text-align:right">${rupiah(item.harga)}</td>
            <td style="text-align:right">${rupiah(item.subtotal)}</td>
        </tr>`
    ).join("");

    let struk = `
    <html>
    <head><title>Struk</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 350px; margin: 20px auto; color: #333; font-size: 13px; }
        h2 { text-align: center; margin-bottom: 5px; font-size: 18px; }
        .sub { text-align: center; color: #888; font-size: 12px; margin-bottom: 15px; }
        .info { border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 10px 0; margin-bottom: 10px; }
        .info p { margin: 3px 0; font-size: 12px; }
        .info span { color: #888; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th { font-size: 11px; color: #888; text-align: left; padding: 5px 0; border-bottom: 1px solid #ddd; }
        th:nth-child(2) { text-align: center; }
        th:nth-child(3), th:nth-child(4) { text-align: right; }
        td { padding: 4px 0; font-size: 12px; }
        .summary { border-top: 1px dashed #ccc; padding-top: 10px; }
        .summary p { display: flex; justify-content: space-between; margin: 3px 0; font-size: 13px; }
        .summary .total { font-size: 16px; font-weight: bold; border-top: 1px solid #333; padding-top: 8px; margin-top: 8px; }
        .pembayaran { border-top: 1px dashed #ccc; padding-top: 10px; margin-top: 10px; text-align: center; font-size: 13px; }
        .pembayaran strong { font-size: 14px; }
        .footer { text-align: center; margin-top: 15px; color: #888; font-size: 11px; }
        .footer .thanks { font-size: 14px; font-weight: 600; color: #333; margin-top: 5px; }
        @media print { body { margin: 0; } }
    </style>
    </head>
    <body>
    <script>
        window.onload = function() {
            window.print();
        };
    </script>
        <h2>🛒 HIHI SHOP</h2>
        <p style="text-align:center; font-size:10px; margin-top:-5px; margin-bottom:10px; color:#666;">Jl. Raya Magersari No 40 Kabupaten Pasuruan JAWA TIMUR</p>
        <div class="sub">Struk Pembayaran</div>

        <div class="info">
            <p><span>No. Transaksi:</span> ${noTrx}</p>
            <p><span>Kasir:</span> ${namaKasir}</p>
            <p><span>Tanggal:</span> ${tanggal}</p>
            <p><span>Waktu:</span> ${waktu}</p>
        </div>

        <table>
            <thead>
                <tr><th>Barang</th><th>Qty(P)</th><th>Harga/P</th><th>Subtotal</th></tr>
            </thead>
            <tbody>${items}</tbody>
        </table>

        <div class="summary">
            <p><span>Subtotal</span><span>${rupiah(total)}</span></p>
            <p><span>Diskon (10%)</span><span>- ${rupiah(diskon)}</span></p>
            <p><span>PPN (11%)</span><span>+ ${rupiah(ppn)}</span></p>
            <p class="total"><span>Total Bayar</span><span>${rupiah(totalAkhir)}</span></p>
            ${metodeBayar === 'Tunai' ? `
                <p><span>Bayar</span><span>${rupiah(bayar)}</span></p>
                <p><span>Kembalian</span><span>${rupiah(kembalian > 0 ? kembalian : 0)}</span></p>
            ` : ''}
        </div>

        <div class="pembayaran">
            Metode Pembayaran: <strong>${metodeBayar}</strong>
            ${metodeBayar === 'QRIS' ? '<br><img src="qris.png" style="width:100px; height:100px; margin-top:10px; border:1px solid #ddd;">' : ''}
        </div>

        <div class="footer">
            <p>Barang yang sudah dibeli tidak dapat dikembalikan.</p>
            <div class="thanks">Terima Kasih!</div>
            <div style="margin-top:10px;">
                <img src="qris.png" style="width:50px; height:50px; opacity:0.5;">
                <p style="font-size:9px; color:#aaa;">Scan untuk bukti transaksi digital</p>
            </div>
        </div>
    </body>
    </html>`;

    let win = window.open("", "_blank", "width=400,height=600");
    win.document.write(struk);
    win.document.close();
}

// INIT
tampilkan();

// ===== TAMPIL DETAIL PEMBAYARAN =====
function tampilDetailBayar() {
    // Sembunyikan semua detail
    const details = document.querySelectorAll('.detail-bayar');
    details.forEach(d => d.style.display = 'none');

    // Tampilkan detail sesuai pilihan
    const metode = document.querySelector('input[name="metodeBayar"]:checked').value;
    const idMap = {
        "Tunai": "detailTunai",
        "QRIS": "detailQRIS",
        "Transfer Bank": "detailTransferBank",
        "E-Wallet": "detailE-Wallet",
        "Kartu Debit": "detailKartuDebit"
    };
    const el = document.getElementById(idMap[metode]);
    if (el) el.style.display = 'block';
}

function hitungKembalian() {
    const uangBayar = parseInt(document.getElementById("uangBayar").value) || 0;
    const kembalianText = document.getElementById("kembalianText");

    let kembalian = uangBayar - totalBelanja;
    if (kembalian < 0) kembalian = 0;

    kembalianText.textContent = rupiah(kembalian);
}