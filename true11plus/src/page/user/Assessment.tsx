import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  BookOpen,
  Target,
  Heart,
  DollarSign,
  Globe,
} from 'lucide-react';

// Interface definitions
interface StudentProfile {
  id?: string;
  userId?: string;
  academicBackground: {
    currentGrade: string;
    gpa: number;
    subjects: string[];
    testScores: {
      sat?: number;
      act?: number;
      toefl?: number;
      ielts?: number;
    };
  };
  interests: string[];
  careerGoals: string[];
  extracurriculars: string[];
  financialConstraints: {
    budget: string;
    needFinancialAid: boolean;
    scholarshipInterest: boolean;
  };
  preferences: {
    countries: string[];
    studyLevel: string;
    fieldOfStudy: string[];
  };
  selectedUniversities: number[];
  assessmentComplete: boolean;
}

const Assessment = () => {
  const navigate = useNavigate();
  // Safe access to auth context
  // const authContext = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const user = authContext?.user;

  // NEW STATE: Tracks if the user has clicked "Start"
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  // Initial state strictly typed
  const [formData, setFormData] = useState<StudentProfile>({
    academicBackground: {
      currentGrade: '',
      gpa: 0,
      subjects: [],
      testScores: {},
    },
    interests: [],
    careerGoals: [],
    extracurriculars: [],
    financialConstraints: {
      budget: '',
      needFinancialAid: false,
      scholarshipInterest: false,
    },
    preferences: {
      countries: [],
      studyLevel: '',
      fieldOfStudy: [],
    },
    selectedUniversities: [],
    assessmentComplete: false,
  });

  const totalSteps = 6;

  // --- Data Arrays ---
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English Literature', 'History', 'Geography', 'Economics', 'Psychology',
    'Art', 'Music', 'Foreign Languages', 'Philosophy', 'Political Science'
  ];

  const interests = [
    'Technology', 'Healthcare', 'Business', 'Arts & Design', 'Science',
    'Engineering', 'Education', 'Sports', 'Music', 'Writing',
    'Research', 'Social Work', 'Environment', 'Politics', 'Travel'
  ];

  const careerGoals = [
    'Software Engineer', 'Doctor', 'Business Executive', 'Teacher', 'Scientist',
    'Artist', 'Lawyer', 'Engineer', 'Researcher', 'Entrepreneur',
    'Consultant', 'Designer', 'Journalist', 'Psychologist', 'Architect'
  ];

  const extracurriculars = [
    'Student Government', 'Sports Teams', 'Music Band/Orchestra', 'Drama Club',
    'Debate Team', 'Volunteer Work', 'Research Projects', 'Internships',
    'Part-time Job', 'Art Club', 'Science Olympiad', 'Model UN',
    'Coding Club', 'Environmental Club', 'Language Club'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Netherlands', 'Switzerland', 'Singapore', 'Japan',
    'South Korea', 'New Zealand', 'Sweden', 'Denmark', 'Norway'
  ];

  const fieldsOfStudy = [
    'Computer Science', 'Engineering', 'Business Administration', 'Medicine',
    'Law', 'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics',
    'Economics', 'Political Science', 'International Relations', 'Art & Design',
    'Literature', 'History', 'Philosophy', 'Education', 'Environmental Science'
  ];

  // --- Handlers ---

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const keys = field.split('.');

    // TS Fix: Explicitly type 'obj' as any to allow dynamic indexing
    const currentArray = keys.reduce((obj: any, key) => obj?.[key], formData) as string[] || [];

    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);

    setFormData(prev => {
      // TS Fix: Cast newData to any to allow deep nested assignment via keys
      const newData: any = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        // Use spread to ensure immutability for the nested object
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = newArray;
      return newData;
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    const keys = field.split('.');
    setFormData(prev => {
      // TS Fix: Cast newData to any to allow deep nested assignment via keys
      const newData: any = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        // Use spread to ensure immutability for the nested object
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would save this to the backend here
    const completeProfile = {
      ...formData,
      assessmentComplete: true,
    };

    console.log("Submitting:", completeProfile);
    navigate('/user/dashboard');
  };

  // --- Render Steps ---

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Let's Build Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            This assessment helps us match you with the best universities and scholarships tailored to your unique goals.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-bold text-gray-900">What we'll cover:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              Academic History
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              Interests & Passions
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              Career Goals
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              Study Preferences
            </div>
          </div>
        </div>

        <button
          onClick={() => setAssessmentStarted(true)}
          className="w-full md:w-auto bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Start Assessment
        </button>

        <p className="text-sm text-gray-500">
          Takes approximately 2-3 minutes
        </p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <BookOpen className="h-16 w-16 text-blue-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Academic Background</h2>
              <p className="text-gray-600">Tell us about your current academic status</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Grade/Year
                </label>
                <select
                  value={formData.academicBackground?.currentGrade || ''}
                  onChange={(e) => handleInputChange('academicBackground.currentGrade', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current GPA (0-4.0 scale)
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.1"
                  value={formData.academicBackground?.gpa || ''}
                  onChange={(e) => handleInputChange('academicBackground.gpa', parseFloat(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Subjects you're studying or have studied
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.academicBackground?.subjects?.includes(subject) || false}
                      onChange={(e) => handleArrayChange('academicBackground.subjects', subject, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SAT Score (optional)
                </label>
                <input
                  type="number"
                  min="400"
                  max="1600"
                  value={formData.academicBackground?.testScores?.sat || ''}
                  onChange={(e) => handleInputChange('academicBackground.testScores.sat', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1450"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TOEFL Score (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.academicBackground?.testScores?.toefl || ''}
                  onChange={(e) => handleInputChange('academicBackground.testScores.toefl', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-blue-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Interests & Passions</h2>
              <p className="text-gray-600">What subjects and activities interest you most?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select your interests (choose at least 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests?.includes(interest) || false}
                      onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Extracurricular Activities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {extracurriculars.map((activity) => (
                  <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.extracurriculars?.includes(activity) || false}
                      onChange={(e) => handleArrayChange('extracurriculars', activity, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{activity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="h-16 w-16 text-blue-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Career Goals</h2>
              <p className="text-gray-600">What career paths are you considering?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select potential career goals (choose at least 2)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {careerGoals.map((career) => (
                  <label key={career} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.careerGoals?.includes(career) || false}
                      onChange={(e) => handleArrayChange('careerGoals', career, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{career}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="h-16 w-16 text-blue-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial Considerations</h2>
              <p className="text-gray-600">Help us understand your financial situation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Budget for Education
              </label>
              <select
                value={formData.financialConstraints?.budget || ''}
                onChange={(e) => handleInputChange('financialConstraints.budget', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Budget Range</option>
                <option value="Under $10,000">Under $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                <option value="Over $75,000">Over $75,000</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.financialConstraints?.needFinancialAid || false}
                  onChange={(e) => handleInputChange('financialConstraints.needFinancialAid', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">I need financial aid to attend university</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.financialConstraints?.scholarshipInterest || false}
                  onChange={(e) => handleInputChange('financialConstraints.scholarshipInterest', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">I'm interested in scholarship opportunities</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="h-16 w-16 text-blue-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Study Preferences</h2>
              <p className="text-gray-600">Where and what would you like to study?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Level
              </label>
              <select
                value={formData.preferences?.studyLevel || ''}
                onChange={(e) => handleInputChange('preferences.studyLevel', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Study Level</option>
                <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                <option value="Graduate">Graduate (Master's)</option>
                <option value="Doctorate">Doctorate (PhD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Preferred Countries (select up to 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {countries.map((country) => (
                  <label key={country} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences?.countries?.includes(country) || false}
                      onChange={(e) => handleArrayChange('preferences.countries', country, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Fields of Study (select up to 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {fieldsOfStudy.map((field) => (
                  <label key={field} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences?.fieldOfStudy?.includes(field) || false}
                      onChange={(e) => handleArrayChange('preferences.fieldOfStudy', field, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
              <p className="text-gray-600">Review your information and submit to get personalized recommendations</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Academic Background</h3>
                <p className="text-gray-700">
                  Grade: {formData.academicBackground?.currentGrade},
                  GPA: {formData.academicBackground?.gpa}
                </p>
                <p className="text-gray-700">
                  Subjects: {formData.academicBackground?.subjects?.join(', ')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                <p className="text-gray-700">{formData.interests?.join(', ')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Career Goals</h3>
                <p className="text-gray-700">{formData.careerGoals?.join(', ')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Study Preferences</h3>
                <p className="text-gray-700">
                  Level: {formData.preferences?.studyLevel},
                  Countries: {formData.preferences?.countries?.join(', ')}
                </p>
                <p className="text-gray-700">
                  Fields: {formData.preferences?.fieldOfStudy?.join(', ')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                <p className="text-gray-700">{formData.financialConstraints?.budget}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If we haven't started yet, show the Intro/Start Screen
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderStartScreen()}
      </div>
    );
  }

  // Once started, show the multi-step form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Student Assessment</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Complete Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;