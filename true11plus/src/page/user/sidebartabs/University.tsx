import { GraduationCap, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { universityData } from '../../../data/mentor/overview';

const University = () => (
    <div className="space-y-3 animate-in fade-in duration-500">
        <div>
            <h3 className="font-bold text-gray-900">University Recommendations</h3>
            <p className="text-gray-500 text-sm">Schools that match your profile and goals.</p>
        </div>

        {universityData.map((uni) => (
            <div key={uni.id} className=" p-6 rounded-xl shadow-xs hover:shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{uni.name}</h3>
                    </div>
                    <div className="flex items-center space-x-3 font-medium">
                        <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold">{uni.chance} Chance</div>
                        <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{uni.match} Match</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Why it's a good match</h4>
                        <ul className="space-y-3">{uni.goodMatchReasons.map((r, i) => (<li key={i} className="flex items-start text-gray-600 text-sm"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />{r}</li>))}</ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> To improve your chances</h4>
                        <ul className="space-y-3">{uni.improvementTips.map((t, i) => (<li key={i} className="flex items-start text-gray-600 text-sm"><TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />{t}</li>))}</ul>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-50 gap-4">
                    <button className="text-indigo-600 font-medium flex items-center hover:underline">View University Details <ChevronRight className="w-5 h-5 ml-1" /></button>
                    <button className="w-full sm:w-auto bg-[#1a56db] hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-200">Connect with Mentor</button>
                </div>
            </div>
        ))}
    </div>
);

export default University;