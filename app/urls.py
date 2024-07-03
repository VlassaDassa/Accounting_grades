from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='main'),

    # Староста и администратор
    path('administrator', views.admin_page, name='admin_page'),
    path('manager_panel', views.manager_panel, name='manager_panel'),
    
    # Авторизация
    path('login', views.login_view, name='login_view'),

    # Группы
    path('get_groups', views.get_groups, name='get_groups'),
    path('remove_group/<id>', views.remove_group, name='remove_group'),
    path('add_group', views.add_group, name='add_group'),
    path('update_group', views.update_group, name='update_group'),
    path('get_group_for_student_name/<student_name>', views.get_group_for_student_name, name='get_group_for_student_name'),

     # Специальности
    path('get_specializations', views.get_specializations, name='get_specializations'),
    path('add_specializations', views.add_specializations, name='add_specializations'),
    path('update_specializations', views.update_specializations, name='update_specializations'),
    path('remove_specialization/<id>', views.remove_specialization, name='remove_specialization'),

    # Предметы
    path('get_subjects_for_group/<group_id>', views.get_subjects_for_group, name='get_subjects_for_group'),
    path('get_subjects_for_specialization/<group_id>', views.get_subjects_for_specialization, name='get_subjects_for_specialization'),
    path('get_subjects', views.get_subjects, name='get_subjects'),
    path('remove_subject/<id>', views.remove_subject, name='remove_subject'),
    path('add_subject', views.add_subject, name='add_subject'),
    path('update_subject', views.update_subject, name='update_subject'),

    # Оценки
    path('get_grades_for_group/<group_id>/<period_id>', views.get_grades_for_group, name='get_grades_for_group'),
    path('get_grades', views.get_grades, name='get_grades'),
    path('remove_grade/<subject_name>/<period_id>/<group_id>', views.remove_grade, name='remove_grade'),
    path('add_grade', views.add_grade, name='add_grade'),
    path('update_grade', views.update_grade, name='update_grade'),
    path('update_grades_for_group', views.update_grades_for_group, name='update_grades_for_group'),

    # Студенты
    path('get_students_for_group/<group_id>', views.get_students_for_group, name='get_students_for_group'),
    path('get_students_for_group_name/<group_name>', views.get_students_for_group_name, name='get_students_for_group_name'),
    path('get_students', views.get_students, name='get_students'),
    path('remove_student/<id>', views.remove_student, name='remove_student'),
    path('add_student', views.add_student, name='add_student'),
    path('update_student', views.update_student, name='update_student'),

    # Периоды
    path('get_periods', views.get_periods, name='get_periods'),
    path('remove_period/<id>', views.remove_period, name='remove_period'),
    path('add_period', views.add_period, name='add_period'),
    path('update_period', views.update_period, name='update_period'),

    # Старосты
    path('get_managers', views.get_managers, name='get_managers'),
    path('remove_manager/<id>', views.remove_manager, name='remove_manager'),
    path('add_manager', views.add_manager, name='add_manager'),
    path('update_manager', views.update_manager, name='update_manager'),
    
    # Отчёт
    path('get_report/<group_name>/<period_id>', views.get_report, name='get_report'),
    path('get_report_for_student/<student_id>/<period_id>/<group_name>', views.get_report_for_student, name='get_report'),
    path('generate_report/<group_name>/<period_id>/<student_id>', views.generate_report, name='generate_report'),
]