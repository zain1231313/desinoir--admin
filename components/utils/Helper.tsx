// utils/apiHelper.js
import API_ENDPOINT from '../apiRoutes/ApiRoutes';
// import { setData, setError, setLoading } from "@/store/HomeSlice";
// import { Data } from "@/types/dataTypes";
import getAndDecryptCookie, { getCookies } from '../libs/auth';
import toast from 'react-hot-toast';

export const postLogin = async (email: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        email: email,
        password: password,
        role: 'admin',
    });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.LOGIN, requestOptions);
        const result = await response.json(); // Assuming the API returns JSON

        if (response.ok) {
            return result; // Return the result for further processing
        }

        throw new Error(result.message || 'Login failed'); // Handle errors
    } catch (error) {
        console.error('Error making POST request:', error);
        throw error;
    }
};

export const fetchHomeData = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_HOME_PAGE, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Unknown error');
        return null;
    }
};
export const createHeaderHome = async (formData: FormData) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_MAIN_HOME, requestOptions);
        const result = await response.json();
        console.log('Errors==>', result);
        return result;
    } catch (error: any) {
        toast.error(error);
    }
};
export const createServiceHome = async (formData: FormData) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_SERVICE_HOME, requestOptions);
        const result = await response.json();
        console.log('Errors==>', result);
        return result;
    } catch (error: any) {
        toast.error(error);
    }
};
export const createMainSection = async (formData: FormData) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_CREATIVE_HOME, requestOptions);
        const result = await response.json();
        console.log('Errors==>', result);
        return result;
    } catch (error: any) {
        toast.error(error);
    }
};
export const createExpertise = async (formData: FormData) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_EXPERTISE_HOME, requestOptions);
        const result = await response.json();
        console.log('Errors==>', result);
        return result;
    } catch (error: any) {
        toast.error(error);
    }
};
export const submitTeamHeader = async (values: any) => {
    const formData = new FormData();
    formData.append('enTitle', values.enTitle);
    formData.append('arTitle', values.arTitle);

    formData.append('enSubTitle', values.enSubTitle);
    formData.append('arSubTitle', values.arSubTitle);

    if (values.servicePrimaryImage) {
        formData.append('emoji', values.servicePrimaryImage);
    }

    const response = await fetch(API_ENDPOINT.UPDATE_TEAM_HEADER, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
    });

    return response.json();
};
export const GetTeamHeader = async (type: any) => {
    // console.log('type=>', type);
    // Construct query string from queryParams

    // Create headers with Authorization token
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    // Set default options
    const defaultOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
    };

    try {
        // Fetch data from the API
        const response = await fetch(API_ENDPOINT.GET_TEAM_HEADER + `${type}`, defaultOptions);

        // Check for non-OK response status

        // Parse and return the response as JSON
        return await response.json();
    } catch (error) {
        // Log and rethrow the error for further handling
        console.error('Fetch error:', error);
        throw error;
    }
};

// /////////// slider Crud
export const fetchSliderData = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_SLIDERS, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching slider data:', error);
        throw error;
    }
};

export const addSliderData = async (data: { enText: string; arText: string; type: string }) => {
    try {
        const response = await fetch(API_ENDPOINT.ADD_SLIDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding slider data:', error);
        throw error;
    }
};

export const updateSliderData = async (
    id: string,
    data: {
        enText: string;
        arText: string;
        type: string;
    }
) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_SLIDERS + `${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    } catch (error) {
        console.error('Error updating slider data:', error);
        throw error;
    }
};
export const deleteRequest = async (id: string): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_SLIDERS + `${id}`, requestOptions);

        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// team memebers

export const fetchTeamMembers = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(API_ENDPOINT.TEAM_SECTION, requestOptions);
    const data = await response.json();
    return data;
};

export const addTeamMember = async (teamMemberData: FormData): Promise<any> => {

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: teamMemberData,
        redirect: 'follow' as RequestRedirect,
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_TEAM, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding team member:', error);
        throw error;
    }
};


export async function updateTeamMember(id: string, formData: FormData) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.UPDATE_TEAM + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating team member:', error);
        throw error; // Re-throw the error to handle it in the component
    }
}

export const addType = async (type: string): Promise<any> => {
    console.log("Type Add Request =>", type);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);
    myHeaders.append('Content-Type', 'application/json'); // Specify content type as JSON

    const rawData = JSON.stringify({ type }); // Convert data to JSON string

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: rawData, // Use the JSON string in the body
        redirect: 'follow',
    };

    try {
        // Send POST request to add the new type
        const response = await fetch(API_ENDPOINT.ADD_TYPE, requestOptions);

        // Check if response is successful
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add type');
        }

        // Parse response
        const result = await response.json();
        console.log('Type added successfully:', result);
        return result;

    } catch (error: any) {
        console.error('Error adding type:', error.message || error);
        throw new Error(error.message || 'An error occurred while adding the type');
    }
};
export const fetchType = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(API_ENDPOINT.GET_TYPE, requestOptions);
    const data = await response.json();
    return data;
};
export async function updateType(id: string, type: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);
    myHeaders.append('Content-Type', 'application/json'); // Set the Content-Type to JSON

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({ type }), // Send raw JSON data
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.UPDATE_TYPE + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating team member:', error);
        throw error; // Re-throw the error to handle it in the component
    }
}

export const deleteType = async (id: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_TYPE + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
};

export const deleteTeamMember = async (id: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_MEMBER + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
};
// our Work
export const fetchAllOurWork = async (): Promise<any> => {
    const response = await fetch(API_ENDPOINT.OUR_WORK_SECTION, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
};
export const updateProblemStatement = async (id: string, data: any) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_WORK_PROBLEM + `${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Ensure you're sending JSON
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: JSON.stringify(data), // Convert data to JSON string
        });

        if (!response.ok) {
            const errorResult = await response.json(); // Get error message from the response
            throw new Error(errorResult.message || 'Failed to update problem statement');
        }

        const result = await response.json();
        return result; // Return the updated problem statement
    } catch (error) {
        console.error('Error updating problem statement:', error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};
export const updateOurWorkProblem = async (id: string, data: any) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_WORK_PROBLEM + `${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: data,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
};
export const updateOurWorkChallenges = async (id: string, data: any) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_WORK_CHALLENGE + `${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: data,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
};
export const updateOurWorkSolution = async (id: string, data: any) => {
    console.log('Solution Data=>', data);
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_WORK_SOLUTION + `${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: data,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
};

export const updateWorkMajorScreen = async (id: string, data: FormData) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_OUR_WORK_MAJOR_SCREEN + `${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: data,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
};

export const updateWorkData = async (id: string, data: FormData) => {
    try {
        const response = await fetch(API_ENDPOINT.UPDATE_OUR_WORK_SECTION + `${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: data, // FormData will automatically set the correct Content-Type
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
};

export async function deleteWorkById(id: string): Promise<any> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_OUR_WORK_SECTION + `${id}`, requestOptions);

        const result = await response.json(); // Assuming JSON response, change if needed
        return result;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}

export const addOurWork = async (data: any) => {
    console.log(data);

    const formData = new FormData();

    // Append text fields
    formData.append('subtitle', data.subtitle || '');
    formData.append('arSubtitle', data.arSubtitle || '');
    formData.append('title', data.title || '');
    formData.append('arTitle', data.arTitle || '');
    formData.append('types', data.types || '');
    formData.append('description', data.description || '');
    formData.append('arDescription', data.arDescription || '');
    formData.append('ProblemStatementTitle', data.ProblemStatementTitle || '');
    formData.append('arProblemStatementTitle', data.arProblemStatementTitle || '');
    formData.append('ProblemStatementDescription', data.ProblemStatementDescription || '');
    formData.append('arProblemStatementDescription', data.arProblemStatementDescription || '');
    formData.append('challengesTitle', data.challengesTitle || '');
    formData.append('arChallengesTitle', data.arChallengesTitle || '');
    formData.append('challengesDescription', data.challengesDescription || '');
    formData.append('arChallengesDescription', data.arChallengesDescription || '');
    formData.append('SolutionTitle', data.SolutionTitle || '');
    formData.append('arSolutionTitle', data.arSolutionTitle || '');
    formData.append('SolutionDescription', data.SolutionDescription || '');
    formData.append('arSolutionDescription', data.arSolutionDescription || '');
    formData.append('description2', data.description2 || '');
    formData.append('arDescription2', data.arDescription2 || '');

    // Append images
    if (data.primaryImage) {
        formData.append('primaryImage', data.primaryImage);
    }
    if (data.descriptionImage) {
        formData.append('descriptionImage', data.descriptionImage);
    }
    if (data.problemImage) {
        formData.append('ProblemStatementImage', data.problemImage);
    }
    if (data.challengeImage) {
        formData.append('challengeImage', data.challengeImage);
    }
    if (data.solutionImage) {
        formData.append('SolutionImage', data.solutionImage);
    }
    if (data.description2Image) {
        formData.append('description2Image', data.description2Image);
    }

    // Handle multiple screen images
    if (data.majorScreensImages && Array.isArray(data.majorScreensImages)) {
        data.majorScreensImages.forEach((image: File, index: number) => {
            formData.append(`MajorScreensImages`, image);
        });
    }

    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };

        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_MAIN, requestOptions);

        const result = await response.json(); // Use .text() if the response is plain text
        return result;
    } catch (error) {
        console.error('Error in addOurWork:', error);
        throw error;
    }
};
export const addOurWorkMain = async (data: any) => {
    const formData = new FormData();
    formData.append('subtitle', data.subtitle || '');
    formData.append('arSubtitle', data.arSubtitle || '');
    formData.append('title', data.title || '');
    formData.append('arTitle', data.arTitle || '');
    formData.append('types', data.types || '');
    formData.append('description', data.description || '');
    formData.append('arDescription', data.arDescription || '');
    if (data.primaryImage) {
        formData.append('primaryImage', data.primaryImage);
    }
    if (data.descriptionImage) {
        formData.append('descriptionImage', data.descriptionImage);
    }
    console.log('Main Work=>', formData);
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };
        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_MAIN, requestOptions);
        console.log('Response =>', response);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in addOurWork:', error);
        throw error;
    }
};
export const addOurWorkProblem = async (data: any) => {
    console.log('Before Form=>', data);
    const formData = new FormData();
    formData.append('ProblemStatementTitle', data.ProblemStatementTitle || '');
    formData.append('arProblemStatementTitle', data.arProblemStatementTitle || '');
    formData.append('ProblemStatementDescription', data.ProblemStatementDescription || '');
    formData.append('arProblemStatementDescription', data.arProblemStatementDescription || '');
    formData.append('ourWorkId', data.ourWorkId || '');

    if (data.ProblemStatementImage) {
        formData.append('ProblemStatementImage', data.ProblemStatementImage);
    }
    console.log('Problem =>', formData);
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };
        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_PROBLEM, requestOptions);
        console.log('Response =>', response);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in Problem:', error);
        throw error;
    }
};

export const addOurWorkChallenge = async (data: any) => {
    console.log('Before Form=>', data);
    const formData = new FormData();
    formData.append('challengesTitle', data.challengesTitle || '');
    formData.append('arChallengesTitle', data.arChallengesTitle || '');
    formData.append('challengesDescription', data.challengesDescription || '');
    formData.append('arChallengesDescription', data.arChallengesDescription || '');
    formData.append('ourWorkId', data.ourWorkId || '');

    if (data.challengeImage) {
        formData.append('challengeImage', data.challengeImage);
    }
    console.log('Problem =>', formData);
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };
        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_CHALLENGE, requestOptions);
        console.log('Response =>', response);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in Problem:', error);
        throw error;
    }
};
export const addOurWorkSolution = async (data: any) => {
    console.log('Before Form=>', data);
    const formData = new FormData();
    formData.append('SolutionTitle', data.SolutionTitle || '');
    formData.append('arSolutionTitle', data.arSolutionTitle || '');
    formData.append('SolutionDescription', data.SolutionDescription || '');
    formData.append('arSolutionDescription', data.arSolutionDescription || '');
    formData.append('ourWorkId', data.ourWorkId || '');

    if (data.SolutionImage) {
        formData.append('SolutionImage', data.SolutionImage);
    }
    console.log('Solution =>', formData);
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };
        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_SOLUTION, requestOptions);
        console.log('Response =>', response);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in Problem:', error);
        throw error;
    }
};
export const addOurWorkMajorScreen = async (data: any) => {
    console.log('Before Form=>', data);
    const formData = new FormData();
    formData.append('description2', data.description2 || '');
    formData.append('arDescription2', data.arDescription2 || '');
    formData.append('ourWorkId', data.ourWorkId || '');
    if (data.description2Image) {
        formData.append('description2Image', data.description2Image);
    }

    // Handle multiple screen images
    if (data.MajorScreensImages && Array.isArray(data.MajorScreensImages)) {
        data.MajorScreensImages.forEach((image: File, index: number) => {
            formData.append(`MajorScreensImages`, image);
        });
    }
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: formData,
            redirect: 'follow',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        };
        const response = await fetch(API_ENDPOINT.ADD_OUR_WORK_MAJOR_SCREEN, requestOptions);
        console.log('Response =>', response);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in Problem:', error);
        throw error;
    }
};

////////all headers

export const fetchAllHeaders = async (): Promise<any> => {
    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_ALL_HEADERS, requestOptions);

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const addHeader = async (headerData: { enHeaderTitle: string; arHeaderTitle: string; type: string }) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(headerData);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_ALL_HEADERS, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding header:', error);
        throw error;
    }
};

////Articles

export const fetchArticles = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow' as RequestRedirect,
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_ALL_ARTICLES, requestOptions);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const updateArticle = async (articleId: string, formData: FormData): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.UPDATE_ARTICLE + `${articleId}`, requestOptions);

        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
};

export const deleteArticleRequest = async (id: string): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow', // Spread any additional options provided
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_ARTICLE + `${id}`, requestOptions);

        return await response.json(); // or `response.text()` if expecting plain text
    } catch (error) {
        console.error('Error during DELETE request:', error);
        throw error;
    }
};

export const addNewArticle = async (formData: FormData): Promise<any> => {
    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
            body: formData,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.ADD_ARTICLE, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding article:', error);
        throw error;
    }
};

// Testimonial

export const fetchDataWithToken = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_VOICES, requestOptions);

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const addClientVoice = async (enTitle: string, enSubtitle: string, arTitle: string, arSubtitle: string, voices: any[], image: File | null) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const formData = new FormData();
    formData.append('enTitle', enTitle);
    formData.append('enSubtitle', enSubtitle);
    formData.append('arTitle', arTitle);
    formData.append('arSubtitle', arSubtitle);
    formData.append('voices', JSON.stringify(voices));

    if (image) {
        formData.append('image', image);
    }

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_VOICES, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
export const fetchLogoWithToken = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_LOGO, requestOptions);
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const addLogos = async (darkLogoFile: File | null, lightLogoFile: File | null) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const formdata = new FormData();
    if (darkLogoFile) {
        formdata.append('darkLogo', darkLogoFile, '[PROXY]');
    }
    if (lightLogoFile) {
        formdata.append('lightLogo', lightLogoFile, '[PROXY]');
    }

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_PRODUCT_LOGO, requestOptions);

        const result = await response.json();
        console.log(result);
        return result; // Return result for further processing if needed
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
};

export const updateLogos = async (Data: any | null, productId: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const formData = new FormData();

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: Data,
        redirect: 'follow',
    };

    try {
        console.log('URL=>', `${API_ENDPOINT.UPDATE_LOGO}${productId}`);
        const response = await fetch(`${API_ENDPOINT.UPDATE_LOGO}${productId}`, requestOptions);
        const result = await response.json();
        console.log('Logos updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
};

export const updateClientVoice = async (enTitle: string, enSubtitle: string, arTitle: string, arSubtitle: string, voices: any[], voiceId: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const body = JSON.stringify({
        enTitle,
        enSubtitle,
        arTitle,
        arSubtitle,
        voices: JSON.stringify(voices),
    });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body,
        redirect: 'follow',
    };

    try {
        const response = await fetch(`${API_ENDPOINT.UPDATE_VOICES}${voiceId}`, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteProductLogos = async (id: string): Promise<void> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_PRODUCT_LOGO + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting Product Logos:', error);
        throw error;
    }
};
export const deleteClientVoice = async (id: string): Promise<void> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_VOICES + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting client voice:', error);
        throw error;
    }
};

const fetchAboutData = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_ABOUT, requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default fetchAboutData;

export const postAboutData = async (formData: FormData): Promise<any> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.ADD_ABOUT, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting about data:', error);
        throw error;
    }
};
export const AboutCreatives = async (formData: FormData): Promise<any> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.ADD_ABOUT, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting about data:', error);
        throw error;
    }
};
export const AboutProjects = async (formData: FormData): Promise<any> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.ADD_ABOUT_COUNTER, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting about data:', error);
        throw error;
    }
};
export const AboutWhyChooses = async (formData: FormData): Promise<any> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.ADD_ABOUT_WHYCHOOOSE, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting about data:', error);
        throw error;
    }
};

/////////////// Uistore

export const fetchUIStoreData = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_UISTORE, requestOptions);

        const result = await response.json();
        return result.data; // returning only the data part
    } catch (error) {
        console.error('Error fetching UI Store data:', error);
        return [];
    }
};

// updateUiStore.ts
export const updateUiStore = async (id: string, values: any) => {
    const formData = new FormData();

    // Append text fields to FormData
    formData.append('title', values.title);
    formData.append('arTitle', values.titleAr);
    formData.append('subtitle', values.subtitle);
    formData.append('arSubtitle', values.subtitleAr);
    formData.append('priceOrFree', values.priceOrFree);
    formData.append('types', values.types);
    formData.append('buylink', values.buylink);
    formData.append('uIKitrecommendedTitle', values.uIKitrecommendedTitle);
    formData.append('arUIKitrecommendedTitle', values.uIKitrecommendedTitleAr);
    formData.append('uIKitrecommendedDescription', values.uIKitrecommendedDescription);
    formData.append('arUIKitrecommendedDescription', values.uIKitrecommendedDescriptionAr);
    formData.append('whatinsideTitle', values.whatinsideTitle);
    formData.append('arWhatinsideTitle', values.whatinsideTitleAr);
    formData.append('whatinsideDescription', values.whatinsideDescription);
    formData.append('arWhatinsideDescription', values.whatinsideDescriptionAr);
    formData.append('licenseTitle', values.licenseTitle);
    formData.append('arLicenseTitle', values.licenseTitleAr);
    formData.append('licenseDescription', values.licenseDescription);
    formData.append('arLicenseDescription', values.licenseDescriptionAr);

    // Append images if available
    if (values.primaryImage) {
        formData.append('primaryImage', values.primaryImage);
    }
    if (Array.isArray(values.sliderImages)) {
        values.sliderImages.forEach((image: File | string, index: number) => {
            if (image instanceof File) {
                // Handle the case where image is a File
                formData.append('sliderImages', image, `sliderImage${index + 1}.jpg`);
            } else if (typeof image === 'string') {
                // Handle the case where image is a string (URL)
                // You can choose to skip appending or handle it differently
                formData.append('sliderImageUrls', image);
            }
        });
    }

    // Add any additional images if needed
    if (values.descriptionImage) {
        formData.append('descriptionImage', values.descriptionImage);
    }

    if (values.ProblemStatementImage) {
        formData.append('ProblemStatementImage', values.ProblemStatementImage);
    }

    if (values.challengeImage) {
        formData.append('challengeImage', values.challengeImage);
    }

    if (values.SolutionImage) {
        formData.append('SolutionImage', values.SolutionImage);
    }

    if (values.description2Image) {
        formData.append('description2Image', values.description2Image);
    }

    if (Array.isArray(values.MajorScreensImages) && values.MajorScreensImages.length > 0) {
        values.MajorScreensImages.forEach((image: File, index: number) => {
            formData.append('MajorScreensImages', image, `MajorScreenImage${index + 1}.jpg`);
        });
    }

    try {
        const response = await fetch(`${API_ENDPOINT.UPDATE_UISTORE}${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
                // Content-Type is not set for FormData
            },
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating UiStore:', error);
        throw error;
    }
};

export async function addUiStore(data: any, id: any) {
    console.log('data ====================', data);
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('arTitle', data.arTitle);
    formData.append('subtitle', data.subtitle);
    formData.append('arSubtitle', data.arSubtitle);
    formData.append('priceOrFree', data.priceOrFree);
    formData.append('typeId', id);
    formData.append('buylink', data.buylink);
    formData.append('uIKitrecommendedTitle', data.uIKitrecommendedTitle);
    formData.append('arUIKitrecommendedTitle', data.arUIKitrecommendedTitle);
    formData.append('uIKitrecommendedDescription', data.uIKitrecommendedDescription);
    formData.append('arUIKitrecommendedDescription', data.arUIKitrecommendedDescription);
    formData.append('whatinsideTitle', data.whatinsideTitle);
    formData.append('arWhatinsideTitle', data.arWhatinsideTitle);
    formData.append('whatinsideDescription', data.whatinsideDescription);
    formData.append('arWhatinsideDescription', data.arWhatinsideDescription);
    formData.append('licenseTitle', data.licenseTitle);
    formData.append('arLicenseTitle', data.arLicenseTitle);
    formData.append('licenseDescription', data.licenseDescription);
    formData.append('arLicenseDescription', data.arLicenseDescription);
    formData.append('description', data.Description);
    formData.append('ardescription', data.DescriptionAr);

    // Append files
    if (data.primaryImage) {
        formData.append('primaryImage', data.primaryImage);
    }
    if (data.sliderImages) {
        data.sliderImages.forEach((file: File) => {
            formData.append('sliderImages', file);
        });
    }

    try {
        const response = await fetch(API_ENDPOINT.ADD_UISTORE, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`, // If you're using a token
            },
        });

        const result = await response.json();
        return result; // Return result for further use if needed
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw error for further handling if needed
    }
}

// apiHelper.ts or apiHelper.js

export const deleteUiStore = async (id: string): Promise<void> => {
    try {
        const response = await fetch(API_ENDPOINT.DELETE_UISTORE + `${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
            },
        });

        const result = await response.json();

        console.log('Deletion successful:', result);
    } catch (error) {
        console.error('Error deleting UiStore:', error);
        // Handle the error appropriately in your application
    }
};

/// footer

export const getFooterData = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const response = await fetch(API_ENDPOINT.GET_FOOTER, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to handle it in the calling code if necessary
    }
};

export const addFooterData = async (footerData: any) => {
    try {
        // Creating the headers for the request
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);
        myHeaders.append('Content-Type', 'application/json');

        // Creating the body as a JSON string
        const bodyData = JSON.stringify({
            greetingTitle: footerData.greetingTitle,
            arGreetingTitle: footerData.arGreetingTitle,
            greetingDescription: footerData.greetingDescription,
            arGreetingDescription: footerData.arGreetingDescription,
            contactInfo: {
                phone: footerData.phone,
                email: footerData.email,
                address: footerData.address,
            },
            socialLinks: {
                facebook: footerData.facebook,
                instagram: footerData.instagram,
                linkedIn: footerData.linkedIn,
                dribble: footerData.dribble,
            },
            rights: footerData.rights,
        });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: bodyData, // Send JSON data as a string
            redirect: 'follow',
        };

        // Making the request
        const response = await fetch(API_ENDPOINT.ADD_FOOTER, requestOptions);

        // Parsing and returning the response
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting footer data:', error);
        throw error;
    }
};

////////faqs

// helper.ts

export const getFaqs = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow' as RequestRedirect,
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_FAQS, requestOptions);

        const result = await response.json(); // Parse JSON if the response is in JSON format
        return result;
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error; // Re-throw the error so that the calling function can handle it
    }
};

export const updateFaq = async (id: string, updatedData: any) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        enQuestion: updatedData.enQuestion,
        arQuestion: updatedData.arQuestion,
        enAnswer: updatedData.enAnswer,
        arAnswer: updatedData.arAnswer,
    });

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(API_ENDPOINT.UPDATE_FAQS + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating FAQ:', error);
        throw error;
    }
};

export const createFaq = async (faqData: { enQuestion: string; arQuestion: string; enAnswer: string; arAnswer: string; type: string }) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const raw = JSON.stringify(faqData);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(API_ENDPOINT.CREATE_FAQ, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating FAQ:', error);
        throw error;
    }
};

export async function deleteFaq(id: string): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_FAQS + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
    }
}

export const GetServices = async (type: any) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    // Set default options
    const defaultOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
    };

    try {
        console.log(type);
        // Fetch data from the API
        const response = await fetch(API_ENDPOINT.GET_SERVICES + `${type}`, defaultOptions);
        const responseData = await response.json()
        // Check for non-OK response stat

        // Parse and return the response as JSON
        return responseData
    } catch (error) {
        // Log and rethrow the error for further handling
        console.error('Fetch error:', error);
        throw error;
    }
};
export const submitChooseData = async (values: any, type: any) => {
    const formData = new FormData();
    console.log(type);
    formData.append('type', values.type);
    formData.append('whyChooseDesiniorMainTitle', values.whyChooseDesinior);
    formData.append('arWhyChooseDesiniorMainTitle', values.whyChooseDesiniorAr);

    const response = await fetch(API_ENDPOINT.UPDATE_CHOOSE, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
    });

    return response.json();
};

export const submitServiceData = async (values: any, type: any) => {
    const formData = new FormData();
    console.log("Type Are Here", type);
    // Append values to formData
    formData.append('typeId', type);
    formData.append('serviceTitle', values.serviceTitle);
    formData.append('arServiceTitle', values.serviceTitleAr);

    formData.append('serviceDescription', values.serviceDescription);
    formData.append('arServiceDescription', values.serviceDescriptionAr);

    if (values.servicePrimaryImage) {
        formData.append('servicePrimaryImage', values.servicePrimaryImage);
    }
    if (values.serviceSecondaryImage) {
        formData.append('serviceSecondaryImage', values.serviceSecondaryImage);
    }

    const response = await fetch(API_ENDPOINT.UPDATE_SERVICES, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
    });

    return response.json();
};

export const submitProcessData = async (values: any, type: any) => {
    const formData = new FormData();


    console.log("Type-==->", type);

    if (values.Processimage) {
        formData.append('ourprocessImage', values.Processimage);
    }

    // Process Section
    formData.append('ourProcessMainTitle', values.ProcessMainTitle);
    formData.append('arOurProcessMainTitle', values.ProcessMainTitleAr);

    formData.append('ourProcessMainSubTitle', values.ProcessMainSubTitle);
    formData.append('arOurProcessMainSubTitle', values.ProcessMainSubTitleAr);

    formData.append('ourProcessMainDescription', values.ProcessmainDescription);
    formData.append('arOurProcessMainDescription', values.ProcessmainDescriptionAr);
    formData.append('type', type);

    // Call API
    const response = await fetch(API_ENDPOINT.UPDATE_PROCESS, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
    });

    return response.json();
};
export const weWorkSubmitData = async (values: any, type: any) => {
    const formData = new FormData();


    formData.append('howWorksMainTitle', values.maintitle);
    formData.append('arHowWorksMainTitle', values.maintitleAr);

    formData.append('howWorksMainSubTitle', values.mainSubTitle);
    formData.append('arHowWorksMainSubTitle', values.mainSubTitleAr);

    formData.append('howWorksMainDescription', values.mainDescription);
    formData.append('arHowWorksMainDescription', values.mainDescriptionAr);

    formData.append('typeId', type);
    const response = await fetch(API_ENDPOINT.UPDATE_WEWORK, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${getAndDecryptCookie('AccessToken')}`,
        },
    });
    console.log('Response=>', response);

    return response.json();
};

export const addServiceData = async (
    workIcon: any,
    workId: string,
    workArId: string,
    type: any,
    howWorksData: any[], // Expecting arrays for each data type
    arHowWorksData: any[]
    // ourProcessData: any[],
    // arOurProcessData: any[],
    // whyChooseDesiniorData: any[],
    // arWhyChooseDesiniorData: any[]
) => {
    console.log(howWorksData);
    try {
        // Headers setup
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        // Form data setup
        const formdata = new FormData();

        formdata.append('howWorksData[]', JSON.stringify(howWorksData));
        formdata.append('arHowWorksData[]', JSON.stringify(arHowWorksData));

        // formdata.append("ourProcessData[]", JSON.stringify(ourProcessData));
        // formdata.append("arOurProcessData[]", JSON.stringify(arOurProcessData));
        // formdata.append("whyChooseDesiniorData[]", JSON.stringify(whyChooseDesiniorData));
        // formdata.append("arWhyChooseDesiniorData[]", JSON.stringify(arWhyChooseDesiniorData));

        formdata.append('workIcon', workIcon);
        formdata.append('type', type.type);
        formdata.append('workId', workId);
        formdata.append('arworkId', workArId);

        // Request options
        const requestOptions: RequestInit = {
            method: 'POST',
            headers,
            body: formdata,
            redirect: 'follow',
        };

        // Make the fetch call
        const response = await fetch(API_ENDPOINT.UPDATE_SERVICES, requestOptions);

        const result = await response.json();
        console.log('Service data added:', result);
        return result;
    } catch (error) {
        console.error('Error adding service data:', error);
        throw error;
    }
};
export const addWorkData = async (
    workIcon: any,
    type: any,
    howWorksData: any[], // Expecting arrays for each data type
    arHowWorksData: any[]
    // ourProcessData: any[],
    // arOurProcessData: any[],
    // whyChooseDesiniorData: any[],
    // arWhyChooseDesiniorData: any[]
) => {
    console.log(howWorksData);
    try {
        // Headers setup
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        // Form data setup
        const formdata = new FormData();

        formdata.append('howWorksData[]', JSON.stringify(howWorksData));
        formdata.append('arHowWorksData[]', JSON.stringify(arHowWorksData));

        // formdata.append("ourProcessData[]", JSON.stringify(ourProcessData));
        // formdata.append("arOurProcessData[]", JSON.stringify(arOurProcessData));
        // formdata.append("whyChooseDesiniorData[]", JSON.stringify(whyChooseDesiniorData));
        // formdata.append("arWhyChooseDesiniorData[]", JSON.stringify(arWhyChooseDesiniorData));

        formdata.append('workIcon', workIcon);
        formdata.append('typeId', type);

        // Request options
        const requestOptions: RequestInit = {
            method: 'POST',
            headers,
            body: formdata,
            redirect: 'follow',
        };

        // Make the fetch call
        const response = await fetch(API_ENDPOINT.UPDATE_WORKCARD, requestOptions);

        const result = await response.json();
        console.log('Service data added:', result);
        return result;
    } catch (error) {
        console.error('Error adding service data:', error);
        throw error;
    }
};
export const addServiceData2 = async (
    // workIcon: any,
    // workId: string,
    // workArId: string,
    type: any,
    // howWorksData: any[], // Expecting arrays for each data type
    // arHowWorksData: any[],
    ourProcessData: any[],
    arOurProcessData: any[]
    // whyChooseDesiniorData: any[],
    // arWhyChooseDesiniorData: any[]
) => {
    try {
        // Headers setup
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        // Form data setup
        const formdata = new FormData();

        // formdata.append("howWorksData[]", JSON.stringify(howWorksData));
        // formdata.append("arHowWorksData[]", JSON.stringify(arHowWorksData));

        formdata.append('ourProcessData[]', JSON.stringify(ourProcessData));
        formdata.append('arOurProcessData[]', JSON.stringify(arOurProcessData));
        // formdata.append("whyChooseDesiniorData[]", JSON.stringify(whyChooseDesiniorData));
        // formdata.append("arWhyChooseDesiniorData[]", JSON.stringify(arWhyChooseDesiniorData));

        // formdata.append("workIcon", workIcon);
        formdata.append('type', type);
        // formdata.append("workId", workId);
        // formdata.append("arworkId", workArId);

        // Request options
        const requestOptions: RequestInit = {
            method: 'POST',
            headers,
            body: formdata,
            redirect: 'follow',
        };

        // Make the fetch call
        const response = await fetch(API_ENDPOINT.UPDATE_PROCESS_CARD, requestOptions);

        const result = await response.json();
        console.log('Service data added:', result);
        return result;
    } catch (error) {
        console.error('Error adding service data:', error);
        throw error;
    }
};
export const addServiceData3 = async (
    values: any,
    Type: any,
    whyChooseData: any,
    arWhyChooseData: any
    // howWorksData: any[], // Expecting arrays for each data type
    // arHowWorksData: any[],
    // ourProcessData: any[],
    // arOurProcessData: any[],
) => {
    try {
        console.log('//////////////////Helper data//////////////////');
        console.log(values.workIcon);
        console.log(Type);
        console.log(whyChooseData);
        console.log(arWhyChooseData);
        console.log('////////////////////////////////////');
        // Headers setup
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        // Form data setup
        const formdata = new FormData();

        formdata.append('icon', values.workIcon);
        formdata.append('type', Type);
        formdata.append('whyChooseDesiniorData', whyChooseData);
        formdata.append('arWhyChooseDesiniorData', arWhyChooseData);

        // formdata.append("whyChooseDesiniorId", values.whyChooseDesiniorId);
        // formdata.append("arwhyChooseDesiniorId", values.arwhyChooseDesiniorId);

        // Request options
        const requestOptions: RequestInit = {
            method: 'POST',
            headers,
            body: formdata,
            redirect: 'follow',
        };

        // Make the fetch call
        const response = await fetch(API_ENDPOINT.UPDATE_CHOOSE_CARD, requestOptions);

        const result = await response.json();
        console.log('Service data added:', result);
        return result;
    } catch (error) {
        console.error('Error adding service data:', error);
        throw error;
    }
};

export const updateServiceData = async (serviceData: { howWorksData: string; arHowWorksData: string; workId: string; workarId: string; type: string; workIcon: File | null }) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const formdata = new FormData();
        formdata.append('workId', serviceData.workId);
        formdata.append('arworkId', serviceData.workarId);
        if (serviceData.workIcon) {
            formdata.append('workIcon', serviceData.workIcon);
        }
        formdata.append('howWorksData', serviceData.howWorksData);
        formdata.append('arHowWorksData', serviceData.arHowWorksData);
        formdata.append('typeId', serviceData.type);

        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow',
        };
        console.log(requestOptions);
        const response = await fetch(API_ENDPOINT.UPDATE_WORK_CARD, requestOptions);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
export const updateServiceData2 = async (serviceData: {
    // howWorksData: string;
    // arHowWorksData: string;
    processData: string;
    arProcessData: string;
    processId: string;
    processarId: string;
    Type: any;
    // whyChooseData: string;
    // arWhyChooseData: string;
    // workId: string;
    // workarId: string;
    // workIcon: File | null;
}) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const formdata = new FormData();
        // formdata.append("howWorksData", serviceData.howWorksData);
        // formdata.append("arHowWorksData", serviceData.arHowWorksData);
        formdata.append('processData', serviceData.processData);
        formdata.append('arProcessData', serviceData.arProcessData);
        // formdata.append("whyChooseData", serviceData.whyChooseData);
        // formdata.append("arWhyChooseData", serviceData.arWhyChooseData);
        // formdata.append("workId", serviceData.workId);
        // formdata.append("arworkId", serviceData.workarId);
        formdata.append('type', serviceData.Type?.type);
        formdata.append('processId', serviceData.processId);
        formdata.append('arprocessId', serviceData.processarId);
        // if (serviceData.workIcon) {
        //   formdata.append("workIcon", serviceData.workIcon);
        // }

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow' as RequestRedirect,
        };

        const response = await fetch(API_ENDPOINT.UPDATE_WORK_CARD, requestOptions);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
export const updateServiceData3 = async (serviceData: {
    whyChooseDesiniorId: string;
    arwhyChooseDesiniorId: string;
    Type: any;
    whyChooseData: string;
    arWhyChooseData: string;
    workIcon: File | null;
}) => {
    console.log('type service===>', serviceData.Type);
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);
        const formdata = new FormData();
        formdata.append('whyChooseData', serviceData.whyChooseData);
        formdata.append('arWhyChooseData', serviceData.arWhyChooseData);
        formdata.append('type', serviceData.Type);
        formdata.append('whyChooseDesiniorId', serviceData.whyChooseDesiniorId);
        formdata.append('arwhyChooseDesiniorId', serviceData.arwhyChooseDesiniorId);
        if (serviceData.workIcon) {
            formdata.append('icon', serviceData.workIcon);
        }

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow' as RequestRedirect,
        };

        const response = await fetch(API_ENDPOINT.UPDATE_CHOOSE_CARD2, requestOptions);

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteServiceData = async (
    workId: string,
    arWorkId: string
) => {
    try {
        const response = await fetch(API_ENDPOINT.DELETE_SERVICES_HOW_DATA, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                arWorkId,
                workId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        //   console.log("Deletion successful:", result);
        return result;
    } catch (error: any) {
        //   console.error("Error deleting how work data:", error.message);
        throw error;
    }
};

export const deleteServiceData2 = async (
    processId: string,
    arprocessId: string
) => {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        // Request body
        const body = JSON.stringify({
            processId,
            arprocessId
        });

        const requestOptions: RequestInit = {
            method: "DELETE",
            headers: headers,
            body: body,
            redirect: "follow"
        };

        const response = await fetch(API_ENDPOINT.DELETE_SERVICES_PROCESS_DATA, requestOptions);


        const result = await response.json();
        console.log('Deletion successful:', result);
        return result;
    } catch (error: any) {
        console.error('Error deleting process data:', error.message);
        throw error;
    }
};
export const deleteServiceData3 = async (

    whyChooseDesiniorId?: string,
    arwhyChooseDesiniorId?: string
) => {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        // Request body
        const body = JSON.stringify({
            whyChooseDesiniorId,
            arwhyChooseDesiniorId
        });

        const requestOptions: RequestInit = {
            method: "DELETE",
            headers: headers,
            body: body,
            redirect: "follow"
        };

        const response = await fetch(API_ENDPOINT.DELETE_SERVICES_WHY_CHOOSE_DATA, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.message}`);
        }

        const result = await response.json();
        console.log('Deletion successful:', result);
        return result;
    } catch (error: any) {
        console.error('Error deleting whyChoose data:', error.message);
        throw error; // Re-throw for higher-level error handling
    }
};

export const getMetaData = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_META_DATA, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fetch error: ', error);
        throw error;
    }
};

export const addMetaTags = async (title: string, description: string, type: string, imageFile: File | null): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('typeId', type);

    if (imageFile) {
        formData.append('image', imageFile, '[PROXY]');
    }

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_META_DATA, requestOptions);
        const result = await response.json();
        return result; // return the response data
    } catch (error) {
        console.error('Error adding meta tag:', error);
        throw error; // re-throw the error for handling in the calling function
    }
};

export const deleteMeta = async (id: string): Promise<any> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${getAndDecryptCookie('AccessToken')}`);

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow' as RequestRedirect,
        };

        const response = await fetch(API_ENDPOINT.DELETE_META_DATA + `${id}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error during DELETE request:', error);
        throw error;
    }
};


export const fetchPageData = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect
    };

    try {
        const response = await fetch(API_ENDPOINT.GET_PAGES, requestOptions);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};


export const addPage = async (pageName: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        pages: pageName,  // Use the parameter pageName
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    try {
        const response = await fetch(API_ENDPOINT.ADD_PAGES, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding page:", error);
        throw error;
    }
};


export const updatePage = async (pageId: string, pageName: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        pages: pageName,  // Use the parameter for page name
    });

    const requestOptions: RequestInit = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    try {
        const response = await fetch(API_ENDPOINT.UPDATE_PAGES + `${pageId}`, requestOptions);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating page:", error);
        throw error;
    }
};


export const deletePage = async (pageId: string) => {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    };

    try {
        const response = await fetch(API_ENDPOINT.DELETE_PAGES + `${pageId}`, requestOptions);


        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to delete the page:', error);
        throw error;
    }
};
