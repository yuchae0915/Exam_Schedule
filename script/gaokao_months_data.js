// 高考115月度进度数据配置
const monthsData = {
    nov: {
        title: '【11月下旬】啟動期',
        icon: '🚀',
        date: '11/20-11/30',
        tasks: [
            { icon: '📚', text: '購買全科課程', status: 'completed' },
            { icon: '📖', text: '資訊管理追趕30%', detail: '5-6堂/17堂', status: 'completed' },
            { icon: '📦', text: '三本書到貨', detail: '開始預習', status: 'completed' }
        ],
        milestones: [
            { text: '資訊管理進度：6/17堂', status: 'completed' },
            { text: '預習進度：資料結構/資料庫各讀2章', status: 'completed' },
            { text: '114國營資通網路/資通安全教材整理完畢', status: 'completed' }
        ]
    },
    dec: {
        title: '【12月】追趕預習月',
        icon: '⚡',
        date: '全月',
        tasks: [
            { icon: '📚', text: '資訊管理完課', detail: '剩11堂', status: 'completed' },
            { icon: '💾', text: '資料庫跟課50%', detail: '8/16堂', status: 'completed' },
            { icon: '🌐', text: '資通網路比對差異', detail: '114教材', status: 'completed' },
            { icon: '📖', text: '資料結構/資通安全', detail: '深度預習', status: 'completed' }
        ],
        milestones: [
            { text: '資訊管理：17/17堂（100%）✅', status: 'completed' },
            { text: '資料庫：8/16堂（50%）', status: 'completed' },
            { text: '資通網路：差異筆記完成', status: 'completed' },
            { text: '預習：資料結構前10章、資通安全基礎概念', status: 'completed' },
            { text: '筆記：資訊管理 v1.0完成', status: 'pending' }
        ]
    },
    jan: {
        title: '【1月】DB攻堅月',
        icon: '💪',
        date: '全月',
        tasks: [
            { icon: '💾', text: '資料庫完課', detail: '剩8堂', status: 'in-progress' },
            { icon: '📊', text: '資料結構開課跟進', detail: '1/23開始', status: 'in-progress' },
            { icon: '🌐', text: '資通網路完成', detail: '1.5x-2.0x倍速', status: 'in-progress' },
            { icon: '📝', text: '資訊管理考古題', detail: '開始練習', status: 'in-progress' }
        ],
        milestones: [
            { text: '資料庫：16/16堂（100%）✅', status: 'pending' },
            { text: '資料結構：5/25堂（20%）', status: 'completed' },
            { text: '資通網路：15/15堂（100%）✅', status: 'completed' },
            { text: '考古：資訊管理近3年', status: 'completed' },
            { text: '筆記：資料庫、資通網路 v1.0完成', status: 'pending' }
        ]
    },
    feb: {
        title: '【2月】DS決戰月',
        icon: '🔥',
        date: '含農曆年',
        tasks: [
            { icon: '📊', text: '資料結構密集攻堅', detail: '農曆年加速', status: 'pending' },
            { icon: '📝', text: '考古題練習', detail: '資訊管理/資料庫/資通網路', status: 'pending' },
            { icon: '🔒', text: '資通安全預習', detail: '持續進行', status: 'pending' }
        ],
        milestones: [
            { text: '資料結構：20/25堂（80%）', status: 'pending' },
            { text: '考古：資料庫/資通網路各3年', status: 'pending' },
            { text: '預習：資通安全完成70%', status: 'pending' },
            { text: '筆記：持續優化', status: 'pending' }
        ]
    },
    mar: {
        title: '【3月】DS收尾+Sec啟動月',
        icon: '🌸',
        date: '全月',
        tasks: [
            { icon: '📊', text: '資料結構完課', detail: '3/13前', status: 'pending' },
            { icon: '🔒', text: '資通安全開始', detail: '3/13起 2.0x倍速', status: 'pending' },
            { icon: '📝', text: '考古題練習', detail: '全面啟動', status: 'pending' }
        ],
        milestones: [
            { text: '資料結構：25/25堂（100%）✅', status: 'pending' },
            { text: '資通安全：7/14堂（50%）', status: 'pending' },
            { text: '考古：各科近5年完成', status: 'pending' },
            { text: '筆記：資料結構 v1.0完成', status: 'pending' },
            { text: '錯題本：開始建立', status: 'pending' }
        ]
    },
    apr: {
        title: '【4月】全科完成月',
        icon: '🎓',
        date: '全月',
        tasks: [
            { icon: '🔒', text: '資通安全完課', detail: '4/24前', status: 'pending' },
            { icon: '📝', text: 'Tier1開戰', detail: '考古題全面', status: 'pending' },
            { icon: '📓', text: '筆記精修', detail: '濃縮版', status: 'pending' }
        ],
        milestones: [
            { text: '資通安全：14/14堂（100%）✅', status: 'pending' },
            { text: '全科課程：87/87堂 ✅', status: 'pending' },
            { text: '考古：高考105-110年', status: 'pending' },
            { text: '筆記：全科v1.0完成', status: 'pending' },
            { text: '錯題本：累積50題', status: 'pending' }
        ]
    },
    may: {
        title: '【5月】考古黃金月',
        icon: '⭐',
        date: '全月',
        tasks: [
            { icon: '🏆', text: 'Tier1制霸', detail: '高考+地特10年', status: 'pending' },
            { icon: '📝', text: '錯題深度複習', detail: '累積題庫', status: 'pending' },
            { icon: '💪', text: '弱點補強', detail: '持續優化', status: 'pending' }
        ],
        milestones: [
            { text: '高考：105-114年全部 ✅', status: 'pending' },
            { text: '地特：105-114年全部 ✅', status: 'pending' },
            { text: '錯題本：累積100題+', status: 'pending' },
            { text: '筆記：v2.0濃縮版完成', status: 'pending' },
            { text: '模擬考：每週2次', status: 'pending' }
        ]
    },
    jun: {
        title: '【6月】巔峰調整月',
        icon: '🎯',
        date: '決戰時刻',
        phases: [
            {
                title: '前半月（6/1-6/15）',
                icon: '📅',
                tasks: [
                    { icon: '📝', text: 'Tier2補充', detail: '調查/關務/國安', status: 'pending' },
                    { icon: '🔄', text: '錯題二次複習', detail: '全面檢視', status: 'pending' },
                    { icon: '💪', text: '維持手感', detail: '穩定練習', status: 'pending' }
                ]
            },
            {
                title: '後半月（6/16-6/30）',
                icon: '🏁',
                tasks: [
                    { icon: '📓', text: '濃縮筆記', detail: '只看精華', status: 'pending' },
                    { icon: '😴', text: '調整作息', detail: '巔峰狀態', status: 'pending' },
                    { icon: '✨', text: '輕量練習', detail: '保持手感', status: 'pending' },
                    { icon: '🚀', text: '最後衝刺', detail: '全力以赴', status: 'pending' }
                ]
            }
        ],
        milestones: [
            { text: 'Tier2：各科3-5年', status: 'pending' },
            { text: '錯題：100%重做一遍', status: 'pending' },
            { text: '心態：穩定自信', status: 'pending' },
            { text: '準備：考試用品齊全', status: 'pending' }
        ]
    }
};

// 月份顺序和按钮配置
const monthsOrder = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];
const monthsButtonLabels = {
    nov: '11月下旬',
    dec: '12月',
    jan: '1月',
    feb: '2月',
    mar: '3月',
    apr: '4月',
    may: '5月',
    jun: '6月'
};
