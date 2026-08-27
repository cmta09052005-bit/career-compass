import ScreenPlaceholder from "@/components/ScreenPlaceholder";

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;
  return (
    <ScreenPlaceholder
      title="Course Detail"
      path={`/results/${courseId}`}
    />
  );
}
