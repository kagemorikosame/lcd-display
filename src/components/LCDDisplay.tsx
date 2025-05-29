"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Station = {
  id: number;
  name: string;
  kana: string;
  line: string;
  isTransfer: boolean;
  transferLines?: string[]; // 乗り換え路線情報を追加
  // メモ：駅ごとの詳細情報や表示タイプなどを追加できる
  // 例: screenType: 'normal' | 'transfer' | 'nextStop';
  //     details: string;
};

// LcdDisplayコンポーネントは、駅情報を取得して表示するコンポーネント
export default function LcdDisplay() {
  // useStateフックを使用して、駅情報の状態を管理
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0); // 現在表示中の駅のインデックス

  // useEffectフックを使用して、コンポーネントのマウント時に駅情報を取得
  useEffect(() => {
    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => {
        setStations(data);
        console.log("取得した駅データ:", data);
        // TODO: 実際の駅データに合わせて初期表示駅を設定
        // setCurrentStationIndex(findIndexToShow(data));
      });
  }, []);

  // TODO: 定期的に次の駅に切り替えるロジックを実装
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
  //   }, 5000); // 5秒ごとに切り替え
  //   return () => clearInterval(timer);
  // }, [stations]);

  const currentStation = stations[currentStationIndex];

  if (!currentStation) {
    return (
      <div className="bg-black text-white p-4 font-mono text-xl">
        駅情報を読み込み中...
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-4 font-mono text-xl">
      {/* 駅情報が存在する場合は、現在の駅の情報を表示 */}
      <motion.div
        key={currentStation.id} // アニメーションのキーを駅IDにすることで、駅が変わるたびにアニメーションが実行される
        initial={{ opacity: 0, x: 100 }} // 初期状態（右から透明で出現）
        animate={{ opacity: 1, x: 0 }} // アニメーション後の状態（左にスライドインして表示）
        transition={{ duration: 0.5 }} // アニメーションの時間
      >
        <div>{currentStation.line}</div>
        <div className="text-4xl my-2">{currentStation.name}</div>
        <div className="text-lg">{currentStation.kana}</div>
        {currentStation.isTransfer && currentStation.transferLines && (
          <div className="mt-4 border-t pt-2">
            <div className="text-yellow-400">お乗り換え</div>
            {currentStation.transferLines.map((line) => (
              <div key={line} className="text-lg">
                {line}
              </div>
            ))}
          </div>
        )}
      </motion.div>
      {/* TODO: ここに次の駅の情報や、路線図などを表示するコンポーネントを追加 */}
    </div>
  );
}
