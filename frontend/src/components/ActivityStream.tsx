import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// タスクの型定義
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  reward: number;
  isMatch?: boolean; // マッチング結果
  evaluating?: boolean; // 評価中フラグ
}

interface ActivityStreamProps {
  isActive: boolean;
  onTaskAccepted: (task: Task) => void;
}

const ActivityStream: React.FC<ActivityStreamProps> = ({ isActive, onTaskAccepted }) => {
  // ダミータスクのサンプルデータ
  const sampleTasks: Task[] = [
    {
      id: 't1',
      title: 'ソーシャルメディア投稿の作成',
      description: '新製品のプロモーション用ソーシャルメディア投稿を作成',
      category: 'コンテンツ作成',
      difficulty: 2,
      reward: 50
    },
    {
      id: 't2',
      title: 'バグ修正レビュー',
      description: 'アプリのバグ修正内容をレビューして承認する',
      category: '品質管理',
      difficulty: 3,
      reward: 75
    },
    {
      id: 't3',
      title: 'データ分析タスク',
      description: 'ユーザー行動データの傾向分析を行う',
      category: '分析',
      difficulty: 4,
      reward: 100
    },
    {
      id: 't4',
      title: 'フィードバック対応',
      description: 'ユーザーからのフィードバックに対応する',
      category: 'カスタマーサポート',
      difficulty: 2,
      reward: 40
    },
    {
      id: 't5',
      title: 'UI改善提案',
      description: 'ユーザーインターフェースの改善案を3つ提案する',
      category: 'デザイン',
      difficulty: 3,
      reward: 80
    }
  ];

  // 現在ストリームに表示されているタスク
  const [streamTasks, setStreamTasks] = useState<Task[]>([]);
  
  // ToDoリストに追加されたタスク
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  
  // 最後に追加したタスクのインデックス
  const lastTaskIndex = useRef(0);
  
  // アクティブな場合、定期的に新しいタスクを追加
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      // サンプルタスクからランダムに選択
      const newTaskIndex = Math.floor(Math.random() * sampleTasks.length);
      const newTask: Task = {
        ...sampleTasks[newTaskIndex],
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        evaluating: false,
        isMatch: undefined
      };
      
      // ストリームにタスクを追加
      setStreamTasks(prev => [...prev, newTask]);
      
      lastTaskIndex.current = (lastTaskIndex.current + 1) % sampleTasks.length;
    }, 5000); // 5秒ごとに新しいタスクを追加
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // タスクを評価するアニメーション処理
  useEffect(() => {
    const evaluateTasks = async () => {
      // 最新の未評価タスクを取得
      const taskToEvaluate = streamTasks.find(t => t.evaluating === false && t.isMatch === undefined);
      if (!taskToEvaluate) return;
      
      // 評価開始
      setStreamTasks(prev => 
        prev.map(t => t.id === taskToEvaluate.id ? { ...t, evaluating: true } : t)
      );
      
      // 評価時間の待機（1〜3秒）
      await new Promise(resolve => 
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );
      
      // マッチング判定（40%の確率でマッチ）
      const isMatch = Math.random() < 0.4;
      
      // 結果を反映
      setStreamTasks(prev => 
        prev.map(t => t.id === taskToEvaluate.id ? { ...t, evaluating: false, isMatch } : t)
      );
      
      // マッチした場合はToDo追加
      if (isMatch) {
        setTimeout(() => {
          setTodoTasks(prev => [...prev, taskToEvaluate]);
          onTaskAccepted(taskToEvaluate);
          
          // 数秒後にストリームから削除
          setTimeout(() => {
            setStreamTasks(prev => prev.filter(t => t.id !== taskToEvaluate.id));
          }, 2000);
        }, 1000);
      } else {
        // マッチしなかった場合は数秒後に削除
        setTimeout(() => {
          setStreamTasks(prev => prev.filter(t => t.id !== taskToEvaluate.id));
        }, 3000);
      }
    };
    
    // 未評価タスクがあれば評価処理を開始
    const hasUnevaluatedTask = streamTasks.some(t => t.evaluating === false && t.isMatch === undefined);
    if (hasUnevaluatedTask) {
      evaluateTasks();
    }
  }, [streamTasks, onTaskAccepted]);

  return (
    <div className="activity-stream-container">
      <div className="stream-section">
        <h3 className="text-lg font-medium mb-2">タスクストリーム</h3>
        <div className="task-stream-area relative h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <AnimatePresence>
            {streamTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ x: '110%' }}
                animate={{
                  x: task.evaluating ? '50%' : (task.isMatch === undefined ? '90%' : (task.isMatch ? '20%' : '-110%')),
                  y: task.evaluating ? '0%' : '0%',
                  scale: task.evaluating ? 1.05 : 1,
                  opacity: task.isMatch === false && task.evaluating === false ? 0.6 : 1
                }}
                exit={{ x: task.isMatch ? '20%' : '-110%', opacity: 0 }}
                transition={{ 
                  x: { type: 'spring', damping: 15, stiffness: 100 },
                  opacity: { duration: 0.5 }
                }}
                className={`task-item absolute p-3 rounded-md shadow-md w-60 ${
                  task.evaluating ? 'bg-yellow-50 border-yellow-200' : 
                  task.isMatch === true ? 'bg-green-50 border-green-200' : 
                  task.isMatch === false ? 'bg-gray-50 border-gray-200' : 
                  'bg-white border-gray-100'
                } border`}
                style={{ top: `${(streamTasks.indexOf(task) % 3) * 33}%` }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <span className="text-xs py-0.5 px-1.5 bg-gray-200 rounded-full">{task.category}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs">難易度: {task.difficulty}/5</span>
                  <span className="text-xs font-medium">報酬: {task.reward} XP</span>
                </div>
                
                {task.evaluating && (
                  <div className="absolute -right-1 -top-1 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                    <span className="animate-pulse">⟳</span>
                  </div>
                )}
                
                {task.isMatch === true && (
                  <div className="absolute -right-1 -top-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                    ✓
                  </div>
                )}
                
                {task.isMatch === false && (
                  <div className="absolute -right-1 -top-1 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                    ✗
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* 評価エリアの視覚的表現 */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-1 bg-yellow-300 opacity-50"></div>
          
          {streamTasks.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>新しいタスクを待っています...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* ToDo蓄積エリア */}
      <div className="todo-section mt-6">
        <h3 className="text-lg font-medium mb-2">マッチしたタスク</h3>
        <div className="todo-tasks-grid grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <div 
                key={task.id} 
                className="todo-task p-3 bg-white rounded-md shadow border border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <span className="text-xs py-0.5 px-1.5 bg-gray-200 rounded-full">{task.category}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs">難易度: {task.difficulty}/5</span>
                  <span className="text-xs font-medium">報酬: {task.reward} XP</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-20 text-gray-400 bg-gray-50 rounded-lg">
              <p>マッチしたタスクはまだありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStream; 