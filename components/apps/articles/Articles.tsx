'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { deleteArticleRequest, fetchArticles } from '@/components/utils/Helper';
import { setSelectedArticle } from '@/store/AricleSlice'; // adjust the path
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';
import $ from 'jquery';
import 'datatables.net';
import DeleteModal from '@/components/Modals/DeleteModal';

interface ArticleResponse {
    mainTitle: LanguageText;
    title: LanguageText;
    name: LanguageText;
    content: LanguageText;
    conclusion: LanguageText;
    adminFeedback: AdminFeedback;
    categoryCounts: CategoryCounts;
    _id: string;
    primaryImage: string;
    secondaryImage: string;
    types: string;
    relatedPosts: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface LanguageText {
    en: string;
    ar: string;
}

interface AdminFeedback {
    name: LanguageText;
    feedback: LanguageText;
    adminImage: string;
}

interface CategoryCounts {
    branding: Category;
    uiux: Category;
    motionGraphic: Category;
    graphicDesign: Category;
}

interface Category {
    text: LanguageText;
    count: number;
}

function Articles() {
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [uiId, setUiId] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const loadArticles = async () => {
            try {
                setLoading(true)
                const results = await fetchArticles();
                setArticles(results.data);
                setLoading(false)
            } catch (error) {
                setLoading(false)
                // console.error('Error loading articles:', error);
            }
        };
        loadArticles();
    }, []);

    useEffect(() => {
        if (!loading && articles.length > 0) {
            // Ensure DataTables is initialized after the table is rendered
            if ($.fn.dataTable.isDataTable('#ArticlesTable')) {
                $('#ArticlesTable').DataTable().destroy(); // Destroy previous instance
            }

            // Initialize DataTables only if the table is present in the DOM
            if ($('#ArticlesTable').length) {
                $('#ArticlesTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [articles, loading]);

    const handleSelectArticle = (article: ArticleResponse) => {
        // console.log('----------Redux----------->', article);
        dispatch(setSelectedArticle(article));
    };
    const handleDeleteClick = async (id: string) => {
        setOpen(!open);
        setUiId(id);
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            setLoading(true);
            const result = await deleteArticleRequest(id); // Pass the articleId to deleteArticleRequest
            setArticles(articles.filter((article) => article?._id !== id)); // Update state after deletion
            if (result.message) {
                setLoading(false);
                toast.success(result.message);
                setOpen(false)
            } else {
                toast.error(result.message);
            }
            // Success message
        } catch (error: any) {
            toast.error(error.message); // Error message in case of failure
        }
    };
    // const handleDelete = async (articleId: string) => {
    //     try {
    //         setLoading(true)
    //         const result = await deleteArticleRequest(articleId); // Pass the articleId to deleteArticleRequest
    //         setArticles(articles.filter(article => article?._id !== articleId)); // Update state after deletion
    //         if (result.message) {
    //             setLoading(false)
    //             toast.success(result.message);
    //         } else {
    //             toast.error(result.message);
    //         }
    //         // Success message
    //     } catch (error: any) {
    //         toast.error(error.message); // Error message in case of failure
    //     }
    // };
    return (
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                        <span>Articles</span>
                    </h2>

                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <Link href={'/apps/articles/add-articles'}>
                                <button type="button" className="btn btn-primary ml-auto">
                                    Add
                                </button>
                            </Link>
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <table id="ArticlesTable" className="display max-sm:overflow-x-scroll">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Main Title English</th>
                                        <th>Main Title Arabic</th>
                                        <th>Created at</th>
                                        <th>Created By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles?.length > 0 ? (
                                        articles?.map((article) => (
                                            <tr key={article?._id}>
                                                <td>
                                                    <Image className="h-10 w-10 rounded-full" src={article?.primaryImage} alt="Article Image" width={40} height={40} />
                                                </td>
                                                <td>{article?.title.en}</td>
                                                <td>{article?.title.ar}</td>
                                                <td>{new Date(article?.createdAt).toLocaleDateString()}</td>
                                                <td>{article?.adminFeedback.name.en}</td>
                                                <td className="h-full gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={{
                                                                pathname: `/apps/articles/edit-article`,
                                                                query: { id: article._id },
                                                            }}
                                                            className="flex items-center"
                                                        >
                                                            <button>
                                                                <IconPencil />
                                                            </button>
                                                        </Link>
                                                        <button onClick={() => handleDeleteClick(article?._id)}>
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8}>No articles available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {open && <DeleteModal open={open} onClose={() => setOpen(false)} onDelete={() => handleConfirmDelete(uiId)} message="Are you sure you want to delete this UI Item?" />}
        </>
    );
}

export default Articles;
