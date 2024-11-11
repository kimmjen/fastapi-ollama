import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [prompt, setPrompt] = useState('');
    const [responseData, setResponseData] = useState(null);  // 전체 응답 객체를 저장할 상태
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태

    const status = async () => {
        try {
            const response = await axios.get('/api/status');
            console.log(response.data);  // 응답 데이터 출력
        } catch (error) {
            console.log('Error fetching status:', error);
        }
    };

    useEffect(() => {
        status();
    }, []);

    const generateText = async () => {
        setIsLoading(true);  // 로딩 시작
        try {
            const response = await axios.post('/api/generate', {
                prompt,
                model: 'llama3',
                stream: false,
            });
            // 필요한 필드만 추출하여 상태에 저장
            const { response: responseObject, elapsed_time } = response.data;
            setResponseData({
                elapsed_time,
                created_at: responseObject.created_at,
                done: responseObject.done,
                done_reason: responseObject.done_reason,
                eval_count: responseObject.eval_count,
                eval_duration: responseObject.eval_duration,
                model: responseObject.model,
                prompt_eval_count: responseObject.prompt_eval_count,
                prompt_eval_duration: responseObject.prompt_eval_duration,
                response: responseObject.response,  // 실제 텍스트 응답
                total_duration: responseObject.total_duration,
                context: responseObject.context,  // 배열 데이터
            });
        } catch (error) {
            console.error('Error generating text:', error);
        } finally {
            setIsLoading(false);  // 로딩 종료
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">AI Text Generator</h2>
            <p className="text-gray-600 mb-6 text-center w-full md:w-1/2">
                Enter a prompt below to generate a response using the AI model. Once you click "Generate," the system will process your request and display the results along with detailed metadata.
            </p>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full md:w-1/2 h-32 p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
                onClick={generateText}
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200 mb-8"
                disabled={isLoading}  // 로딩 중 버튼 비활성화
            >
                {isLoading ? "Generating..." : "Generate"}  {/* 로딩 중 텍스트 표시 */}
            </button>

            {responseData && (
                <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Response Data</h3>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Elapsed Time:</strong> {responseData.elapsed_time} seconds</p>
                        <p className="text-sm text-gray-500">Total time taken for the response to be generated.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Created At:</strong> {responseData.created_at}</p>
                        <p className="text-sm text-gray-500">Timestamp indicating when the response was created.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Done:</strong> {responseData.done ? 'Yes' : 'No'}</p>
                        <p className="text-sm text-gray-500">Indicates whether the processing is complete.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Done Reason:</strong> {responseData.done_reason}</p>
                        <p className="text-sm text-gray-500">Reason for completion (e.g., "stop" or another status).</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Model:</strong> {responseData.model}</p>
                        <p className="text-sm text-gray-500">The model used to generate the response (e.g., "llama3").</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Prompt Evaluation Count:</strong> {responseData.prompt_eval_count}</p>
                        <p className="text-sm text-gray-500">Number of times the prompt was evaluated.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Prompt Evaluation Duration:</strong> {responseData.prompt_eval_duration} ms</p>
                        <p className="text-sm text-gray-500">Time taken for prompt evaluation in milliseconds.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Evaluation Count:</strong> {responseData.eval_count}</p>
                        <p className="text-sm text-gray-500">Total number of evaluations performed.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Evaluation Duration:</strong> {responseData.eval_duration} ms</p>
                        <p className="text-sm text-gray-500">Total time taken for all evaluations in milliseconds.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Total Duration:</strong> {responseData.total_duration} ms</p>
                        <p className="text-sm text-gray-500">The overall duration taken for the request.</p>
                    </div>

                    <div className="text-gray-700 mb-6">
                        <p className="mb-2"><strong>Response Text:</strong> {responseData.response}</p>
                        <p className="text-sm text-gray-500">The main response generated by the model based on your prompt.</p>
                    </div>

                    <div className="text-gray-700">
                        <p className="mb-2"><strong>Context:</strong></p>
                        <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">{JSON.stringify(responseData.context, null, 2)}</pre>
                        <p className="text-sm text-gray-500 mt-2">The context array containing additional tokenized data relevant to the response.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;