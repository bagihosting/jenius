
'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import { generateDailyExam as generateDailyExamFlow } from '@/ai/flows/generate-exam-flow';
import { academicAssistant as academicAssistantFlow } from '@/ai/flows/academic-assistant-flow';

import { type GenerateQuizOutput, type ExamData, type GenerateQuizInput, type HomeworkHelpInput, type HomeworkHelpOutput, type GenerateExamInput, type AcademicAssistantInput, type AcademicAssistantOutput, type Question, type MultipleChoiceQuestion, type UpgradeRequest, type User, UpgradeInfo, type RobloxUser } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, runTransaction, serverTimestamp, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';

// Helper function to remove prefixes (A., B., etc.) and normalize string for comparison
const normalize = (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.replace(/^[A-D]\.\s*/, '').trim().toLowerCase();
};

// Helper to check for duplicate options
const hasDuplicateOptions = (options: string[]): boolean => {
    if (!Array.isArray(options)) return true; // Invalid options format
    const normalizedOptions = options.map(opt => normalize(opt));
    const uniqueOptions = new Set(normalizedOptions);
    return uniqueOptions.size !== normalizedOptions.length;
}

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<{ data?: GenerateQuizOutput; error?: string }> {
  try {
    const quizData = await generateQuizFlow(input);

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz) || quizData.quiz.length === 0) {
      throw new Error('Menerima format kuis yang tidak valid atau kosong dari Ayah Jenius.');
    }
    
    //--- VALIDASI DAN KOREKSI HASIL AI ---//
    const validatedQuiz = quizData.quiz.map(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            console.error('Soal tidak valid: Pilihan jawaban kurang dari 4.', q);
            return null; // Mark question as invalid
        }
        if (hasDuplicateOptions(q.options)) {
            console.error('Soal tidak valid: Terdapat pilihan jawaban yang duplikat.', q);
            return null;
        }
        if (!q.correctAnswer) {
            console.error('Soal tidak valid: Tidak ada jawaban benar.', q);
            return null;
        }

        const normalizedCorrectAnswerFromAI = normalize(q.correctAnswer);
        const matchingOption = q.options.find(opt => normalize(opt) === normalizedCorrectAnswerFromAI);

        if (matchingOption) {
            // Correct `correctAnswer` to match the existing option exactly
            q.correctAnswer = matchingOption;
            return q;
        } else {
            console.error('Soal tidak valid: Jawaban benar tidak ditemukan di dalam pilihan.', q);
            return null;
        }
    }).filter((q): q is Question => q !== null); // Remove all invalid questions

    if (validatedQuiz.length !== quizData.quiz.length) {
        throw new Error('Ayah Jenius membuat beberapa soal yang tidak akurat. Silakan coba buat kuis lagi untuk mendapatkan hasil yang lebih baik.');
    }
    
    quizData.quiz = validatedQuiz;
    //--- AKHIR VALIDASI ---//

    return { data: quizData };
  } catch (e) {
    console.error("generateQuizAction failed:", e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius gagal membuat kuis saat ini. Coba lagi nanti. (Detail: ${errorMessage})`,
    };
  }
}

export async function homeworkHelperAction(
  input: HomeworkHelpInput
): Promise<{ data?: HomeworkHelpOutput; error?: string }> {
    try {
        const result = await answerHomeworkFlow(input);
        if (!result || !result.answer) {
            throw new Error('Ayah Jenius gagal memberikan jawaban atau format jawaban tidak valid.');
        }
        return { data: result };
    } catch (e) {
        console.error("homeworkHelperAction failed:", e);
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat meminta bantuan PR.';
        return {
            error: `Maaf, terjadi kesalahan saat memproses permintaanmu: ${errorMessage}`,
        };
    }
}

export async function generateExamAction(
  input: GenerateExamInput
): Promise<{ data?: ExamData; error?: string }> {
  try {
    const examData = await generateDailyExamFlow(input);

    if (!examData || !examData.multipleChoice || !examData.essay || examData.multipleChoice.length < 5 || examData.essay.length < 2) {
      throw new Error('Menerima format soal ujian yang tidak valid atau tidak lengkap dari Ayah Jenius.');
    }
    
    const validatedMultipleChoice = examData.multipleChoice.map(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            console.error('Soal PG tidak valid: Pilihan jawaban kurang dari 4.', q);
            return null;
        }
        if (hasDuplicateOptions(q.options)) {
            console.error('Soal PG tidak valid: Terdapat pilihan jawaban yang duplikat.', q);
            return null;
        }
        
        const matchingOption = q.options.find(opt => normalize(opt) === normalize(q.correctAnswer));

        if (matchingOption) {
            q.correctAnswer = matchingOption; // Correct the answer to match exactly
            return q;
        } else {
            console.error('Soal PG tidak valid: Jawaban benar tidak ada di pilihan.', q);
            return null;
        }
    }).filter((q): q is MultipleChoiceQuestion => q !== null);

    if (validatedMultipleChoice.length !== examData.multipleChoice.length) {
         throw new Error('Ayah Jenius membuat beberapa soal pilihan ganda yang tidak akurat. Coba lagi untuk hasil yang lebih baik.');
    }
    
    examData.multipleChoice = validatedMultipleChoice;

    return { data: examData };
  } catch (e) {
    console.error("generateExamAction failed:", e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius sedang kesulitan membuat soal ujian harian. Silakan coba lagi nanti. (Detail: ${errorMessage})`,
    };
  }
}

export async function academicAssistantAction(
    input: AcademicAssistantInput
): Promise<{ data?: AcademicAssistantOutput; error?: string }> {
    try {
        const result = await academicAssistantFlow(input);
        if (!result || !result.explanation) {
            throw new Error('Asisten Akademik gagal memberikan jawaban atau format jawaban tidak valid.');
        }
        return { data: result };
    } catch (e) {
        console.error("academicAssistantAction failed:", e);
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat meminta bantuan akademik.';
        return {
            error: `Maaf, terjadi kesalahan saat memproses permintaan Anda: ${errorMessage}`,
        };
    }
}


export async function submitUpgradeRequestAction(
  user: User,
  formData: { universityName: string; major: string }
): Promise<{ success?: boolean; error?: string }> {
  if (!db || !user) {
    return { error: 'Koneksi database atau pengguna tidak ditemukan.' };
  }
  
  const requestData: Omit<UpgradeRequest, 'requestedAt'> = {
    uid: user.uid,
    name: user.name,
    email: user.email,
    username: user.username,
    universityName: formData.universityName,
    major: formData.major,
    status: 'pending',
  };

  try {
    const requestRef = doc(db, `upgradeRequests`, user.uid);
    await setDoc(requestRef, {
        ...requestData,
        requestedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    console.error('submitUpgradeRequestAction failed:', e);
    return { error: `Gagal mengirim pengajuan: ${errorMessage}` };
  }
}

export async function saveUpgradeSettingsAction(
  settings: UpgradeInfo
): Promise<{ success?: boolean; error?: string }> {
  if (!db) {
    return { error: 'Koneksi database tidak ditemukan.' };
  }
  try {
    const settingsRef = doc(db, 'appSettings', 'upgradeInfo');
    await setDoc(settingsRef, settings);
    return { success: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    console.error('saveUpgradeSettingsAction failed:', e);
    return { error: `Gagal menyimpan pengaturan: ${errorMessage}` };
  }
}


export async function checkRobloxUsernameAction(
  username: string,
  currentUserId: string
): Promise<{ exists: boolean; user?: RobloxUser; error?: string }> {
    if (!username) {
        return { exists: false, error: "Username tidak boleh kosong." };
    }
    
    const robloxApiUrl = 'https://users.roblox.com/v1/usernames/users';
    const robloxApiData = {
        usernames: [username],
        excludeBannedUsers: true
    };

    try {
        // Step 1: Check if the username is taken in our database
        if (db) {
            const usernamesRef = collection(db, 'users');
            const q = query(usernamesRef, where("robloxUsername", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                if (userDoc.id !== currentUserId) {
                    return { exists: false, error: "Username Roblox ini sudah digunakan oleh pengguna lain." };
                }
            }
        }
        
        // Step 2: Check with Roblox API if it's a valid username
        const response = await fetch(robloxApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(robloxApiData)
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.errors?.[0]?.message || `Error dari Roblox: ${response.status}`;
            return { exists: false, error: errorMessage };
        }

        const result = await response.json();

        if (result.data && result.data.length > 0) {
            const robloxUser: RobloxUser = {
                id: result.data[0].id,
                name: result.data[0].name,
                displayName: result.data[0].displayName
            };
            return { exists: true, user: robloxUser };
        } else {
            return { exists: false, error: "Username Roblox tidak ditemukan." };
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat memeriksa username Roblox:", error);
        return { exists: false, error: "Gagal terhubung ke server. Silakan coba lagi nanti." };
    }
}

export async function claimDailyBonusAction(uid: string): Promise<{ success: boolean; error?: string; bonus?: number; nextClaim?: number }> {
    if (!db) {
        return { success: false, error: 'Koneksi database gagal.' };
    }

    const userRef = doc(db, `users`, uid);
    const now = Date.now();
    const COOL_DOWN_HOURS = 23; 

    try {
        const awardedBonus = parseFloat((Math.random() * (0.0050 - 0.0010) + 0.0010).toFixed(4));

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("Pengguna tidak ditemukan!");
            }

            const currentUserData = userDoc.data() as User;
            const lastClaimedAt = currentUserData.lastClaimedAt ? (currentUserData.lastClaimedAt as any).toDate().getTime() : 0;
            
            if (lastClaimedAt) {
                const nextClaimTime = lastClaimedAt + COOL_DOWN_HOURS * 60 * 60 * 1000;
                if (now < nextClaimTime) {
                    // Throw a specific error to be caught later
                    throw { code: 'cooldown', nextClaim: nextClaimTime };
                }
            }

            const currentBonus = currentUserData.bonusPoints || 0;
            transaction.update(userRef, { 
                bonusPoints: currentBonus + awardedBonus,
                lastClaimedAt: serverTimestamp() 
            });
        });
        
        return { success: true, bonus: awardedBonus };

    } catch (e: any) {
        if (e.code === 'cooldown') {
            return { success: false, error: 'Anda baru bisa mengklaim bonus lagi nanti.', nextClaim: e.nextClaim };
        }
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
        console.error('claimDailyBonusAction failed:', e);
        return { success: false, error: `Gagal mengklaim bonus: ${errorMessage}` };
    }
}
