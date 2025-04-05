import React, { useState, useEffect } from 'react';

// アイコンコンポーネント
interface IconProps {
  className?: string;
}

const CheckIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RobotIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 8V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V8" stroke="currentColor" strokeWidth="2"/>
    <circle cx="9" cy="14" r="1" fill="currentColor"/>
    <circle cx="15" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const LoaderIcon = ({ className }: IconProps) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// タスクデータ型定義
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  status: 'streaming' | 'matching' | 'matched' | 'rejected' | 'todo' | 'completed';
  matchProgress?: number; // 0-100のマッチング進捗率
  createdAt: Date;
}

// ActivityPage Propsの型定義
interface ActivityPageProps {
  userId: string | null;
  onNavigate?: (page: 'welcome' | 'top' | 'activity') => void;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ userId, onNavigate }) => {
  // タブ状態
  const [activeTab, setActiveTab] = useState<'active' | 'todo' | 'completed'>('active');
  
  // タスクリスト
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // エージェントレベル（1〜10）
  const [agentLevel, setAgentLevel] = useState<number>(3);
  
  // 新しいタスクを生成する関数
  const generateNewTask = (): Task => {
    const categories = ['データ分析', 'サーベイ', 'コンテンツ評価', 'メディア消費', '趣味活動'];
    const id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      id,
      title: `${category}タスク ${Math.floor(Math.random() * 100)}`,
      description: `このタスクは${category}に関するデータを収集・分析します。あなたの嗜好やパターンを学習します。`,
      category,
      reward: Math.floor(Math.random() * 30) + 5, // 5〜35 XP
      status: 'streaming',
      createdAt: new Date()
    };
  };
  
  // タスクストリームシミュレーション
  useEffect(() => {
    // 初期タスク
    const initialTasks: Task[] = [
      {
        id: 'task-initial-1',
        title: 'ショッピング習慣分析',
        description: 'あなたのオンラインショッピングの習慣とパターンを分析します。',
        category: 'データ分析',
        reward: 20,
        status: 'todo',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1日前
      },
      {
        id: 'task-initial-2',
        title: 'メディア消費調査',
        description: 'どのようなメディアをどのくらいの頻度で消費しているか調査します。',
        category: 'サーベイ',
        reward: 15,
        status: 'completed',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2日前
      },
      {
        id: 'task-initial-3',
        title: '位置情報データ分析',
        description: '匿名化された位置情報データを分析します。',
        category: 'データ分析',
        reward: 25,
        status: 'todo',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12時間前
      }
    ];
    
    setTasks(initialTasks);
    
    // 5〜10秒ごとに新しいタスクを追加
    const taskInterval = setInterval(() => {
      const newTask = generateNewTask();
      setTasks(prev => [...prev, newTask]);
      
      // タスクがストリーミング状態からマッチング状態へ
      setTimeout(() => {
        setTasks(prev => 
          prev.map(task => 
            task.id === newTask.id 
              ? { ...task, status: 'matching', matchProgress: 0 } 
              : task
          )
        );
        
        // マッチング進捗のアニメーション
        let progress = 0;
        const matchingInterval = setInterval(() => {
          progress += 5;
          if (progress <= 100) {
            setTasks(prev => 
              prev.map(task => 
                task.id === newTask.id 
                  ? { ...task, matchProgress: progress } 
                  : task
              )
            );
          } else {
            clearInterval(matchingInterval);
            
            // マッチするかどうかをランダムに決定（エージェントレベルが高いほどマッチする確率が高い）
            const matchProbability = 0.3 + (agentLevel / 10) * 0.4; // レベル1で30%、レベル10で70%
            const isMatched = Math.random() < matchProbability;
            
            setTasks(prev => 
              prev.map(task => 
                task.id === newTask.id 
                  ? { 
                      ...task, 
                      status: isMatched ? 'matched' : 'rejected',
                      matchProgress: 100 
                    } 
                  : task
              )
            );
            
            // マッチしたタスクはToDoに移動
            if (isMatched) {
              setTimeout(() => {
                setTasks(prev => 
                  prev.map(task => 
                    task.id === newTask.id 
                      ? { ...task, status: 'todo' } 
                      : task
                  )
                );
              }, 1500);
            } else {
              // マッチしなかったタスクは8秒後に削除
              setTimeout(() => {
                setTasks(prev => prev.filter(task => task.id !== newTask.id));
              }, 8000);
            }
          }
        }, 100); // 100msごとに進捗を更新
      }, 3000); // 3秒後にマッチング開始
    }, Math.floor(Math.random() * 5000) + 5000); // 5〜10秒ごと
    
    return () => {
      clearInterval(taskInterval);
    };
  }, [agentLevel]);
  
  // タスクを完了する
  const completeTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' } 
          : task
      )
    );
  };
  
  // タスクをフィルタリング
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'active') {
      return ['streaming', 'matching', 'matched', 'rejected'].includes(task.status);
    } else if (activeTab === 'todo') {
      return task.status === 'todo';
    } else { // completed
      return task.status === 'completed';
    }
  });
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      {/* Status bar */}
      <div className="w-full h-4"></div>
      
      {/* Header */}
      <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* 戻るボタン */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('top')}
              className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          )}
        </div>
        
        <h1 className="text-xl font-bold">Activity</h1>
        
        <div className="w-16"></div> {/* スペーサー */}
      </div>
      
      {/* タブナビゲーション */}
      <div className="w-full px-4 md:px-6 mb-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === 'active' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === 'todo' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('todo')}
          >
            ToDo
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === 'completed' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="w-full flex-grow px-4 md:px-6 pb-8">
        {/* エージェントステータス */}
        <div className="mb-4 border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <RobotIcon className="text-white h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">Agent Status: Active (Level {agentLevel})</div>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Analyzing task stream</span>
            </div>
          </div>
        </div>
        
        {/* Active タブ: タスクストリームセクション */}
        {activeTab === 'active' && (
          <div className="relative h-[400px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-8">
            {/* タスクストリーム */}
            <div className="h-full w-full overflow-hidden relative">
              {filteredTasks.map(task => {
                // タスクの表示位置を計算
                let taskPosition;
                let animationStyles;
                
                if (task.status === 'streaming') {
                  // 右から左に流れるアニメーション
                  animationStyles = {
                    animation: 'slideInFromRight 10s linear forwards',
                    right: '-300px', // 初期位置
                    top: `${Math.floor(Math.random() * 70) + 15}%`, // ランダムな縦位置
                  };
                } else if (task.status === 'matching') {
                  // 中央に固定
                  animationStyles = {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  };
                } else if (task.status === 'matched') {
                  // 下に移動するアニメーション
                  animationStyles = {
                    animation: 'slideDown 1.5s ease-in-out forwards',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  };
                } else if (task.status === 'rejected') {
                  // 上に移動するアニメーション
                  animationStyles = {
                    animation: 'slideUp 1.5s ease-in-out forwards',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  };
                }
                
                return (
                  <div
                    key={task.id}
                    className={`absolute bg-white rounded-lg shadow-md p-3 border ${
                      task.status === 'matched' ? 'border-green-300' :
                      task.status === 'rejected' ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{
                      width: '250px',
                      ...animationStyles
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        +{task.reward} XP
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {task.description}
                    </div>
                    
                    {/* マッチング進捗バー */}
                    {task.status === 'matching' && typeof task.matchProgress === 'number' && (
                      <div className="w-full mt-2">
                        <div className="text-xs text-gray-500 mb-1 flex justify-between">
                          <span>Analyzing match...</span>
                          <span>{task.matchProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-100" 
                            style={{ width: `${task.matchProgress}%` }} 
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* マッチング結果アイコン */}
                    {task.status === 'matched' && (
                      <div className="absolute -right-2 -top-2 bg-green-500 text-white rounded-full p-1">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                    )}
                    
                    {task.status === 'rejected' && (
                      <div className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1">
                        <XIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* 中央のエージェントアバター */}
              {activeTab === 'active' && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <RobotIcon className="text-white h-12 w-12" />
                  </div>
                  <div className="bg-black text-white text-xs px-2 py-1 rounded-full mt-2 text-center">
                    Level {agentLevel}
                  </div>
                </div>
              )}
            </div>
            
            {/* ストリーミングアニメーション用CSS */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes slideInFromRight {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-400px); }
                }
                
                @keyframes slideDown {
                  0% { transform: translate(-50%, -50%); }
                  100% { transform: translate(-50%, 200%); }
                }
                
                @keyframes slideUp {
                  0% { transform: translate(-50%, -50%); }
                  100% { transform: translate(-50%, -200%); }
                }
              `
            }} />
          </div>
        )}
        
        {/* ToDo タブ */}
        {activeTab === 'todo' && (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだToDoタスクはありません。マッチしたタスクがここに表示されます。
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{task.title}</div>
                    <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      +{task.reward} XP
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {task.description}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                    <button 
                      className="bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                      onClick={() => completeTask(task.id)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Completed タブ */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                完了したタスクはまだありません。
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-gray-500 flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {task.title}
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      +{task.reward} XP
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {task.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    完了: {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage; 