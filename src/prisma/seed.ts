import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const yumeNoRosenLineName = '夢の路線';
const yumeNoRosenStations = [
  { name: '夢始', kana: 'ゆめはじめ', stationNumber: 'Y01', transfers: [] },
  { name: '希望ヶ丘', kana: 'きぼうがおか', stationNumber: 'Y02', transfers: ['光線'] },
  { name: '虹の橋', kana: 'にじのはし', stationNumber: 'Y03', transfers: [] },
  { name: '星見台', kana: 'ほしみだい', stationNumber: 'Y04', transfers: [] },
  { name: '月読温泉', kana: 'つくよみおんせん', stationNumber: 'Y05', transfers: ['温泉郷線'] },
  { name: '風の谷', kana: 'かぜのたに', stationNumber: 'Y06', transfers: [] },
  { name: '森の都', kana: 'もりのみやこ', stationNumber: 'Y07', transfers: [] },
  { name: '天空都市', kana: 'てんくうとし', stationNumber: 'Y08', transfers: ['雲上線', '未来線'] },
  { name: '時間駅', kana: 'じかんえき', stationNumber: 'Y09', transfers: [] },
  { name: '記憶回廊', kana: 'きおくかいろう', stationNumber: 'Y10', transfers: [] },
  { name: '幻影交差点', kana: 'げんえいこうさてん', stationNumber: 'Y11', transfers: ['霧中線'] },
  { name: '静寂の森公園', kana: 'せいじゃくのもりこうえん', stationNumber: 'Y12', transfers: [] },
  { name: '水晶浜', kana: 'すいしょうはま', stationNumber: 'Y13', transfers: ['海底鉄道'] },
  { name: '浮遊島駅', kana: 'ふゆうじまえき', stationNumber: 'Y14', transfers: [] },
  { name: '終着夢', kana: 'しゅうちゃくゆめ', stationNumber: 'Y15', transfers: [] },
];

async function main() {
  console.log(`データベースの初期化を開始します...`);

  // 既存の駅データを削除 (再実行可能なように)
  await prisma.station.deleteMany({});
  console.log('既存の駅データを削除しました。');

  const createdStations = [];

  // 夢の路線を作成
  for (const stationData of yumeNoRosenStations) {
    const station = await prisma.station.create({
      data: {
        name: stationData.name,
        kana: stationData.kana,
        line: yumeNoRosenLineName,
        stationNumber: stationData.stationNumber,
        isTransfer: stationData.transfers.length > 0,
        transferLines: stationData.transfers.length > 0 ? JSON.stringify(stationData.transfers) : null,
        // nextStationId は後で更新
      },
    });
    // 作成した駅を配列に追加
    createdStations.push(station);
    console.log(`駅を作成しました: ${station.name} (ID: ${station.id})`);
  }

  // nextStationId を更新
  for (let i = 0; i < createdStations.length - 1; i++) {
    await prisma.station.update({
      where: { id: createdStations[i].id },
      data: { nextStationId: createdStations[i + 1].id },
    });
    console.log(`${createdStations[i].name}駅の次駅を ${createdStations[i + 1].name} (ID: ${createdStations[i + 1].id}) に設定しました。`);
  }

  console.log(`データベースの初期化が完了しました。`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
