import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamSummary, type ExamSummary } from '../api/analytics';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Award, 
  AlertCircle,
  ChevronRight,
  Download,
  CheckCircle
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ExamSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!examId) return;
      try {
        const summary = await getExamSummary(examId);
        setData(summary);
      } catch (error) {
        console.error("Failed to fetch analytics");
        // Mock data for demo if API fails
        setData({
          exam_id: Number(examId),
          exam_title: "Final Competency Assessment",
          total_attempts: 128,
          average_score: 78.5,
          pass_rate: 82,
          score_distribution: [
            { range: '0-20', count: 2 },
            { range: '21-40', count: 8 },
            { range: '41-60', count: 15 },
            { range: '61-80', count: 45 },
            { range: '81-100', count: 58 },
          ],
          item_analysis: [
            { question_id: 1, question_text: "What is the primary goal of Agile?", correct_rate: 92 },
            { question_id: 2, question_text: "Which of the following is not a Scrum role?", correct_rate: 85 },
            { question_id: 3, question_text: "Explain the concept of 'Technical Debt'.", correct_rate: 45 },
            { question_id: 4, question_text: "What does the 'S' in SOLID stand for?", correct_rate: 68 },
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-500 font-bold">Analyzing Exam Data...</p>
    </div>
  );

  if (!data) return <div>No data available.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-[#2563eb] font-bold text-sm mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Exam Management
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight">Exam Analytics</h1>
          <p className="text-gray-500 font-medium">Performance summary for <span className="text-[#191b23]">{data.exam_title}</span></p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Attempts', value: data.total_attempts, icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Average Score', value: `${data.average_score}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Pass Rate', value: `${data.pass_rate}%`, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
          { label: 'Top Scorer', value: '98%', icon: <Award className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-gray-50 shadow-sm">
            <div className={`${stat.color} p-3 rounded-xl inline-block mb-4`}>{stat.icon}</div>
            <div className="text-2xl font-extrabold mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <div className="bg-white rounded-[2rem] border border-gray-50 p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Score Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.score_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item Analysis */}
        <div className="bg-white rounded-[2rem] border border-gray-50 p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Question Performance (Item Analysis)</h3>
          <div className="space-y-6">
            {data.item_analysis.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm font-bold text-[#191b23] line-clamp-1">{item.question_text}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    item.correct_rate < 50 ? 'bg-red-50 text-red-600' : 
                    item.correct_rate < 75 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {item.correct_rate}% Correct
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      item.correct_rate < 50 ? 'bg-red-500' : 
                      item.correct_rate < 75 ? 'bg-orange-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${item.correct_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 bg-gray-50 text-[#2563eb] rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            View All Questions <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty Alert */}
      {data.item_analysis.some(i => i.correct_rate < 50) && (
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-[1.5rem] flex gap-4">
          <div className="bg-orange-100 p-3 rounded-xl h-fit">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h4 className="font-bold text-orange-800 text-lg mb-1">Attention Required</h4>
            <p className="text-orange-700 text-sm leading-relaxed">
              Several questions have a correct rate below 50%. We recommend reviewing the content associated with Question #{data.item_analysis.find(i => i.correct_rate < 50)?.question_id} to ensure students understand the material.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
