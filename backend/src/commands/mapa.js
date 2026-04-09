module.exports = {
    keys: ['2', 'mapa', 'btn_mapa'],
    async execute(from, whatsappService) {
        const r2Url = "https://pub-be738042d2ac439896bd125bb815623b.r2.dev/1765546918701-mapa_impacto.png";
        await whatsappService.sendImage(from, r2Url, "📍 Mapa de impacto.");
    }
};