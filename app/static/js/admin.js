localStorage.removeItem('group_id')
localStorage.removeItem('period_id')


if (localStorage.getItem('admin') == 'false' || !localStorage.getItem('admin')) {
    if (!($('.container').hasClass('managerPage') && localStorage.getItem('auth'))) {
        alert('Вы не администратор. Уходите')
        window.location.replace('/')
    }
}

if (localStorage.getItem('admin') == 'true') {
    $('.pageTitle').text('Панель управления администратора')
}
else {
    $('.pageTitle').text('Панель управления старосты')
}


// Выбор модели
$('.modelBtnItem').on('click', function() {
    localStorage.removeItem('group_id')
    localStorage.removeItem('period_id')

    let type = $(this).attr('data-type-btn')
    $('.adminTables').remove()

    $('.modelBtnItem').removeClass('currentBtn')
    $(this).addClass('currentBtn')
    
    switch(type) {
        case 'groups': render_groups(); break
        case 'students': render_students(); break
        case 'period': render_periods(); break
        case 'manager': render_manager(); break
        case 'subjects': render_subject(); break
        case 'specializations': render_specializations(); break
        case 'grades': render_grades(); break
    }
})

// Отображение таблицы "Группы"
function render_groups() {
    // Запрос в БД
    request('get_groups')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_groups = response.groups

        // Запрос в БД
        request('get_specializations')
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }

            // Отрисовка
            let all_specializations = JSON.parse(response.specializations)

            var adminTables = $('<div>', {
                'class': 'adminTables'
            });
            
            var rowsWrapper = $('<div>', {
                'class': 'rowsWrapper'
            });


            all_groups.forEach((el, index) => {
                if (index == 0) {
                    render_header(rowsWrapper, Array('Группы', 'Специальность'))
                }

                var longRowWrapper = $('<div>', {
                    'class': 'longRowWrapper',
                    'data-id': `group_${el.id}`,
                })

                var deleteLongRowWrapper = $('<div>', {
                    'class': 'deleteLongRowWrapper',
                })
                
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper rowWrapper--long',
                })

                var dropdown_list = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })

                var dropdown_menu = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))


                all_specializations.forEach((specialization) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `specializations_${specialization.pk}`
                    }).text(specialization.fields.name)

                    dropdown_menu.append(dropdownElement)
                })

                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.group_name
                })

                var dropdownInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.specialization.specialization_name,
                    'data-id': `specialization_${el.specialization.specialization_id}`,
                    'readonly': true
                })
             

                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })

                dropdown_list.append(dropdownInput, dropdown_menu)
                rowWrapper.append(rowInput)
                deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                rowsWrapper.append(longRowWrapper)
            })

            var btnsWrapper = $('<div>', {
                'class': 'btnsWrapper',
            })

            var addBtn = $('<div>', {
                'class': 'adminTablesBtn addBtn',
                'text': 'Добавить',
                'data-type': 'group'
            })

            btnsWrapper.append(addBtn)
            adminTables.append(rowsWrapper, btnsWrapper)
            $('.adminPanelWrapper').append(adminTables)
        })
        .catch((error) => {
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение таблицы "Специальностей"
function render_specializations() {
    // Запрос в БД
    request('get_specializations')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }

        // Отрисовка
        let data = JSON.parse(response.specializations)
        var adminTables = $('<div>', {
            'class': 'adminTables'
        });
        var rowsWrapper = $('<div>', {
            'class': 'rowsWrapper'
        });

        data.forEach((el) => {
            var rowWrapper = $('<div>', {
                'class': 'rowWrapper rowWrapper--long',
                'data-id': `specialization_${el.pk}`
            })

            var rowInput = $('<input>', {
                'type': 'text',
                'class': 'rowInput',
                'value': el.fields.name
            })

            var deleteIcon = $('<img>', {
                'class': 'deleteRow',
                'src': staticUrl + 'img/delete.svg',
            })

            rowWrapper.append(rowInput, deleteIcon)
            rowsWrapper.append(rowWrapper)
        })

        var addBtn = $('<div>', {
            'class': 'adminTablesBtn addBtn',
            'text': 'Добавить',
            'data-type': 'specializations'
        })

        adminTables.append(rowsWrapper, addBtn)
        $('.adminPanelWrapper').append(adminTables)
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение таблицы "Предметы"
function render_subject() {
    render_choiceGroup('subject', period_flag=false, general=true)

    // Запрос в БД
    request('get_specializations')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_specializations = JSON.parse(response.specializations)

        // Запрос в БД
        request('get_subjects')
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }

            // Отрисовка
            let all_subjects = response.subjects

            var adminTables = $('<div>', {
                'class': 'adminTables'
            });
            
            var rowsWrapper = $('<div>', {
                'class': 'rowsWrapper'
            });

            all_subjects.forEach((el, index) => {
                if (index == 0) {
                    render_header(rowsWrapper, Array('Предмет', 'Специальность'))
                }

                var longRowWrapper = $('<div>', {
                    'class': 'longRowWrapper',
                    'data-id': `subject_${el.id}`,
                })

                var deleteLongRowWrapper = $('<div>', {
                    'class': 'deleteLongRowWrapper',
                })
                
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper rowWrapper--long',
                })

                var dropdown_list = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })

                var dropdown_menu = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement',
                    'data-id': `general`
                }).text('Общие'))

                all_specializations.forEach((specialization) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `specialization_${specialization.pk}`
                    }).text(specialization.fields.name)

                    dropdown_menu.append(dropdownElement)
                })

                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.subject_name
                })

                if (el.specialization.specialization_name) {
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': el.specialization.specialization_name,
                        'data-id': `group_${el.specialization.specialization_id}`,
                        'readonly': true
                    })
                }
                else {
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': 'Общие',
                        'data-id': `general`,
                        'readonly': true
                    })
                }
                

                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })

                dropdown_list.append(dropdownInput, dropdown_menu)
                rowWrapper.append(rowInput)
                deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                rowsWrapper.append(longRowWrapper)
            })

            var btnsWrapper = $('<div>', {
                'class': 'btnsWrapper',
            })

            var addBtn = $('<div>', {
                'class': 'adminTablesBtn addBtn',
                'text': 'Добавить',
                'data-type': 'subject'
            })

            btnsWrapper.append(addBtn)
            adminTables.append(rowsWrapper, btnsWrapper)
            $('.adminPanelWrapper').append(adminTables)
        })
        .catch((error) => {
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение таблицы "Студенты"
function render_students() {
    const manager = localStorage.getItem('manager')
    var studentsUrl = 'get_students'
    var group_id = ''

    if (manager) {
        // Окно "Выбор группы"
        request('get_group_for_student_name/' + manager)
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }
            group_id = response.group_id
            studentsUrl ='get_students_for_group/' + group_id

            // Запрос в БД
            request('get_groups')
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                var all_groups = response.groups

                if (manager) {
                    response.groups.forEach((item) => {
                        if (item.id == group_id) {
                            all_groups = [item]
                        }
                    })
                }


                // Запрос в БД
                request(studentsUrl)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    // Отрисовка
                    let data = response.students

                    var adminTables = $('<div>', {
                        'class': 'adminTables'
                    });
                    var rowsWrapper = $('<div>', {
                        'class': 'rowsWrapper'
                    });

                    data.forEach((el, index) => {
                        if (index == 0) {
                            render_header(rowsWrapper, Array('ФИО', 'Группа'))
                        }

                        var longRowWrapper = $('<div>', {
                            'class': 'longRowWrapper',
                            'data-id': `student_${el.student.id}`,
                        })

                        var deleteLongRowWrapper = $('<div>', {
                            'class': 'deleteLongRowWrapper',
                        })
                        
                        var rowWrapper = $('<div>', {
                            'class': 'rowWrapper rowWrapper--long',
                        })

                        var dropdown_list = $('<div>', {
                            'class': 'rowWrapper dropdown-list'
                        })

                        var dropdown_menu = $('<ul>', {
                            'class': 'dropdown-menu'
                        })

                        dropdown_menu.append($('<li>', {
                            'class': 'dropdownElement dropdownFirstElement'
                        }))

                        all_groups.forEach((group) => {
                            var dropdownElement = $('<li>', {
                                'class': 'dropdownElement',
                                'data-id': `group_${group.id}`
                            }).text(group.group_name)

                            dropdown_menu.append(dropdownElement)
                        })

                        var rowInput = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                            'value': el.student.fullname
                        })

                        var dropdownInput = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                            'value': el.group.group_name,
                            'data-id': `group_${el.group.id}`,
                            'readonly': true
                        })

                        var deleteIcon = $('<img>', {
                            'class': 'deleteRow',
                            'src': staticUrl + 'img/delete.svg',
                        })

                        dropdown_list.append(dropdownInput, dropdown_menu)
                        rowWrapper.append(rowInput)
                        deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                        longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                        rowsWrapper.append(longRowWrapper)
                    })

                    var btnsWrapper = $('<div>', {
                        'class': 'btnsWrapper',
                    })

                    var addBtn = $('<div>', {
                        'class': 'adminTablesBtn addBtn',
                        'text': 'Добавить',
                        'data-type': 'student'
                    })

                    btnsWrapper.append(addBtn)
                    adminTables.append(rowsWrapper, btnsWrapper)
                    $('.adminPanelWrapper').append(adminTables)
                })
                .catch((error) => {
                    console.error(error)
                })
            })
            .catch((error) => {
                console.error(error)
            })

        })
        .catch((error) => {
            console.error(error)
        })
        
    }
    else {
        render_choiceGroup('student', period_flag=false, general=false)
        // Запрос в БД
        request('get_groups')
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }
            var all_groups = response.groups

            if (manager) {
                response.groups.forEach((item) => {
                    if (item.id == group_id) {
                        all_groups = [item]
                    }
                })
            }


            // Запрос в БД
            request(studentsUrl)
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }

                // Отрисовка
                let data = response.students

                var adminTables = $('<div>', {
                    'class': 'adminTables'
                });
                var rowsWrapper = $('<div>', {
                    'class': 'rowsWrapper'
                });

                data.forEach((el, index) => {
                    if (index == 0) {
                        render_header(rowsWrapper, Array('ФИО', 'Группа'))
                    }

                    var longRowWrapper = $('<div>', {
                        'class': 'longRowWrapper',
                        'data-id': `student_${el.student.id}`,
                    })

                    var deleteLongRowWrapper = $('<div>', {
                        'class': 'deleteLongRowWrapper',
                    })
                    
                    var rowWrapper = $('<div>', {
                        'class': 'rowWrapper rowWrapper--long',
                    })

                    var dropdown_list = $('<div>', {
                        'class': 'rowWrapper dropdown-list'
                    })

                    var dropdown_menu = $('<ul>', {
                        'class': 'dropdown-menu'
                    })

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement dropdownFirstElement'
                    }))

                    all_groups.forEach((group) => {
                        var dropdownElement = $('<li>', {
                            'class': 'dropdownElement',
                            'data-id': `group_${group.id}`
                        }).text(group.group_name)

                        dropdown_menu.append(dropdownElement)
                    })

                    var rowInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': el.student.fullname
                    })

                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': el.group.group_name,
                        'data-id': `group_${el.group.id}`,
                        'readonly': true
                    })

                    var deleteIcon = $('<img>', {
                        'class': 'deleteRow',
                        'src': staticUrl + 'img/delete.svg',
                    })

                    dropdown_list.append(dropdownInput, dropdown_menu)
                    rowWrapper.append(rowInput)
                    deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                    rowsWrapper.append(longRowWrapper)
                })

                var btnsWrapper = $('<div>', {
                    'class': 'btnsWrapper',
                })

                var addBtn = $('<div>', {
                    'class': 'adminTablesBtn addBtn',
                    'text': 'Добавить',
                    'data-type': 'student'
                })

                btnsWrapper.append(addBtn)
                adminTables.append(rowsWrapper, btnsWrapper)
                $('.adminPanelWrapper').append(adminTables)
            })
            .catch((error) => {
                console.error(error)
            })
        })
        .catch((error) => {
            console.error(error)
        })
    }
    

    
}

// Отображение таблицы "Периоды"
function render_periods() {
    // Запрос в БД
    request('get_periods')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }

        // Отрисовка
        let data = JSON.parse(response.periods)
        var adminTables = $('<div>', {
            'class': 'adminTables'
        });
        var rowsWrapper = $('<div>', {
            'class': 'rowsWrapper'
        });

        data.forEach((el) => {
            var rowWrapper = $('<div>', {
                'class': 'rowWrapper',
                'data-id': `period_${el.pk}`
            })

            var rowInput = $('<input>', {
                'type': 'text',
                'class': 'rowInput',
                'value': el.fields.period
            })

            var deleteIcon = $('<img>', {
                'class': 'deleteRow',
                'src': staticUrl + 'img/delete.svg',
            })

            rowWrapper.append(rowInput, deleteIcon)
            rowsWrapper.append(rowWrapper)
        })

        var addBtn = $('<div>', {
            'class': 'adminTablesBtn addBtn',
            'text': 'Добавить',
            'data-type': 'period'
        })

        adminTables.append(rowsWrapper, addBtn)
        $('.adminPanelWrapper').append(adminTables)
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение таблицы "Оценки"
function render_grades() {
    var group_id = '';
    render_choiceGroup('grades', period_flag=true, general=false);

    setTimeout(() => {
        try {
            var period_id = $('.dropdown-list--period').find('.rowInput').attr('data-id').split('_')[1];
            group_id = $('.dropdown-list--group').find('.rowInput').attr('data-id').split('_')[1];
        } catch (error) {
            console.error('Ошибка при извлечении данных:', error);
        }

        const manager = localStorage.getItem('manager');

        if (manager) {
            request('get_group_for_student_name/' + manager)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка');
                        return false;
                    }
                    group_id = response.group_id;
                    localStorage.setItem('group_id', group_id);
                    localStorage.setItem('period_id', period_id);

                    render_group_grades(group_id, period_id);
                })
                .catch((error) => {
                    console.error('Ошибка при запросе:', error);
                });
        } else {
            localStorage.setItem('group_id', group_id);
            localStorage.setItem('period_id', period_id);

            render_group_grades(group_id, period_id);
        }
    }, 50);
}

// Отображение таблицы "Старосты"
function render_manager() {
    var all_groups

    // Запрос в БД "Группы"
    request('get_groups')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        all_groups = response.groups
    })
    .catch((error) => {
        console.error(error)
    })

    // Запрос в БД "Студенты"
    request(('get_students'))
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_students = response.students

        // Запрос в БД "Менеджеры"
        request('get_managers')
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }

            // Отрисовка
            let data = response.managers
            var adminTables = $('<div>', {
                'class': 'adminTables'
            });
            var rowsWrapper = $('<div>', {
                'class': 'rowsWrapper'
            });

            data.forEach((el, index) => {
                if (index == 0) {
                    render_header(rowsWrapper, Array('Студент', 'Группа', 'Логин', 'Пароль'), long=false)
                }

                var longRowWrapper = $('<div>', {
                    'class': 'longRowWrapper',
                    'data-id': `manager_${el.manager_id}`,
                })

                var deleteLongRowWrapper = $('<div>', {
                    'class': 'deleteLongRowWrapper',
                })
                
                // rowWrapper
                var rowWrapper_login = $('<div>', {
                    'class': 'rowWrapper',
                })

                var rowWrapper_password = $('<div>', {
                    'class': 'rowWrapper',
                })

                // dropdown_list
                var dropdown_list_student = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })

                var dropdown_list_group = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })


                // dropdown_menu
                var dropdown_menu_student = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                var dropdown_menu_group = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                dropdown_menu_student.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))

                dropdown_menu_group.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))


                all_groups.forEach((group) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `group_${group.id}`
                    }).text(group.group_name)

                    dropdown_menu_group.append(dropdownElement)
                })


                all_students.forEach((student) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `student_${student.student.id}`
                    }).text(student.student.fullname)

                    dropdown_menu_student.append(dropdownElement)
                })


                // Row input
                var rowInput_student = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'data-id': `student_${el.student.id}`,
                    'value': el.student.fullname,
                    'readonly': true,
                })

                var rowInput_group = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.group.group_name,
                    'data-id': `group_${el.group.id}`,
                    'readonly': true,
                })

                var rowInput_login = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'data-id': 'login',
                    'value': el.login
                })

                var rowInput_password = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'data-id': 'password',
                    'value': el.password
                })

                dropdown_list_student.append(rowInput_student, dropdown_menu_student)
                dropdown_list_group.append(rowInput_group, dropdown_menu_group)
                rowWrapper_login.append(rowInput_login)
                rowWrapper_password.append(rowInput_password)

                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })

                deleteLongRowWrapper.append(dropdown_list_student, dropdown_list_group, rowWrapper_login, rowWrapper_password)
                longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                rowsWrapper.append(longRowWrapper)
            })

            var btnsWrapper = $('<div>', {
                'class': 'btnsWrapper',
            })

            var addBtn = $('<div>', {
                'class': 'adminTablesBtn addBtn',
                'text': 'Добавить',
                'data-type': 'manager'
            })

            btnsWrapper.append(addBtn)
            adminTables.append(rowsWrapper, btnsWrapper)
            $('.adminPanelWrapper').append(adminTables)
        })
        .catch((error) => {
            console.error(error)
        })
        
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение отчёта
function render_report() {
    request('get_periods')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_periods = JSON.parse(response.periods)

        var dropdown_list = $('<div>', {
            'class': 'rowWrapper dropdown-list reportDropdownList'
        })
    
        var dropdown_menu = $('<ul>', {
            'class': 'dropdown-menu'
        })
    
        dropdown_menu.append($('<li>', {
            'class': 'dropdownElement dropdownFirstElement'
        }))
    
        all_periods.forEach((period) => {
                var dropdownElement = $('<li>', {
                    'class': 'dropdownElement dropdownElement--reportChoicePeriod',
                    'data-id': `period_${period.pk}`
                }).text(period.fields.period)
    
                dropdown_menu.append(dropdownElement)
            })

        var labelForDropDownInput = $('<label>', {
            'class': 'groupInputLabel'
        }).text('Выберите период')
    
        var dropdownInput = $('<input>', {
            'type': 'text',
            'class': 'rowInput',
            'value': all_periods[0].fields.period,
            'data-id': `period_${all_periods[0].pk}`,
            'readonly': true
        })
    
        dropdown_list.append(dropdown_menu, dropdownInput)

        var reportModal = $('<div>').addClass('reportModal');

        var closeButton = $('<div>').addClass('closeButton').text('×');
        
        var inputReportWrapper = $('<div>').addClass('inputReportWrapper');

        var userInputGroup = $('<div>').addClass('userInputGroup');
        var groupInputLabel = $('<label>').addClass('groupInputLabel').attr('for', 'groupInput').text('Введите группу');
        var groupInput = $('<input>').attr({type: 'text', id: 'groupInput', class: 'rowInput'});

        userInputGroup.append(groupInputLabel, groupInput);
        inputReportWrapper.append(labelForDropDownInput, dropdown_list);
        
        const manager = localStorage.getItem('manager')
        if (!manager) {
            inputReportWrapper.append(userInputGroup);
        }
        else {
            request('get_group_for_student_name/' + manager)
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }

                let group_name = response.group_name

                // Добавление ещё одного фильтра (студентов) TODO
                request(`get_students_for_group_name/${group_name}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    const all_students = response.students

                    var dropdown_list = $('<div>', {
                        'class': 'rowWrapper dropdown-list'
                    })

                    var dropdown_menu = $('<ul>', {
                        'class': 'dropdown-menu'
                    })

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement dropdownFirstElement'
                    }))

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `filterStudent_all`
                    }).text('Все'))

                    all_students.forEach((student) => {
                        var dropdownElement = $('<li>', {
                            'class': 'dropdownElement',
                            'data-id': `filterStudent_${student.student.id}`
                        }).text(student.student.fullname)

                        dropdown_menu.append(dropdownElement)
                    })

                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': 'Все',
                        'id': 'filterStudent',
                        'data-id': `filterStudent_all`,
                        'readonly': true
                    })
                    dropdown_list.append(dropdownInput, dropdown_menu)
                    $('.inputReportWrapper').append($('<label>', {
                        'class': 'groupInputLabel'
                    }).text('Выберите студента'))
                    $('.inputReportWrapper').append(dropdown_list)
                })
                .catch((error) => {
                    console.error(error)
                })
            })
            .catch((error) => {
                console.error(error)
            })
        }
    

        var reportModalTitle = $('<h1>').addClass('reportModalTitle').text('Отчёт по группе');

        reportModal.append(closeButton, inputReportWrapper, reportModalTitle);
        $('body').append(reportModal)
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение выбора группы и периода
function render_choiceGroup(type, period_flag=true, general=false) {
    if (type == 'subject') {
        // Выбор специальности (если это предмет)
        request('get_specializations')
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                const all_specializations = JSON.parse(response.specializations)
                
                var choiceGroupModal = $('<div>').addClass('choiceGroupModal');
                var closeChoiceGroupModal = $('<div>').addClass('closeChoiceGroupModal').text('х');
                var labelFirstChoiceGroup = $('<label>').addClass('labelFirstChoiceGroup').attr('for', 'firstChoiceGroup').text('Выберите специальность');
                
                var rowWrapper = $('<div>').addClass('rowWrapper dropdown-list dropdown-list--group');
                var rowInput = $('<input>').attr({
                    'type': 'text',
                    'class': 'rowInput',
                    'value': all_specializations[0].fields.name,
                    'data-id': `group_${all_specializations[0].pk}`,
                    'readonly': 'readonly'
                });
                var dropdownMenu = $('<ul>').addClass('dropdown-menu');
                var dropdownFirstElement = $('<li>').addClass('dropdownElement dropdownFirstElement');
                dropdownMenu.append(dropdownFirstElement)
                all_specializations.forEach((specialization) => {
                    var dropdownElement = $('<li>').addClass('dropdownElement dropdownElement--choiceGroupModal')
                    .attr({'data-id': `group_${specialization.pk}`, 'data-type': type}).text(specialization.fields.name);
                    dropdownMenu.append(dropdownElement)
                })
                choiceGroupModal.append(
                    closeChoiceGroupModal,
                    labelFirstChoiceGroup,
                    rowWrapper.append(rowInput, dropdownMenu)
                );
                $('body').append(choiceGroupModal)
                $('.overlay').show()


            })
            .catch((error) => {
                console.error(error)
            })
        return
    }


    request('get_periods')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }

        var all_periods = JSON.parse(response.periods)

        // Запрос в БД
        request('get_groups')
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                // Отрисовка
                let data = response.groups
                
                var choiceGroupModal = $('<div>').addClass('choiceGroupModal');
                var closeChoiceGroupModal = $('<div>').addClass('closeChoiceGroupModal').text('х');
                var labelFirstChoiceGroup = $('<label>').addClass('labelFirstChoiceGroup').attr('for', 'firstChoiceGroup').text('Выберите группу');
                
                var rowWrapper = $('<div>').addClass('rowWrapper dropdown-list dropdown-list--group');
                var rowInput = $('<input>').attr({
                    'type': 'text',
                    'class': 'rowInput',
                    'value': data[0].group_name,
                    'data-id': `group_${data[0].id}`,
                    'readonly': 'readonly'
                });
                var dropdownMenu = $('<ul>').addClass('dropdown-menu');
                var dropdownFirstElement = $('<li>').addClass('dropdownElement dropdownFirstElement');
                dropdownMenu.append(dropdownFirstElement)
                data.forEach((group) => {
                    var dropdownElement = $('<li>').addClass('dropdownElement dropdownElement--choiceGroupModal')
                    .attr({'data-id': `group_${group.id}`, 'data-type': type}).text(group.group_name);
                    dropdownMenu.append(dropdownElement)
                })
                
                // Отображение списка с периодом
                if (period_flag) {
                    var rowWrapper_period = $('<div>').addClass('rowWrapper dropdown-list dropdown-list--period');
                    var rowInput_period = $('<input>').attr({
                        'type': 'text',
                        'class': 'rowInput',
                        'value': all_periods[0].fields.period,
                        'data-id': `period_${all_periods[0].pk}`,
                        'readonly': 'readonly'
                    });
                    var dropdownMenu_period = $('<ul>').addClass('dropdown-menu');
                    var dropdownFirstElement_period = $('<li>').addClass('dropdownElement dropdownFirstElement');
                    dropdownMenu_period.append(dropdownFirstElement_period)
                    all_periods.forEach((period) => {
                        var dropdownElement_period = $('<li>').addClass('dropdownElement dropdownElement--choiceGroupModal')
                        .attr({'data-id': `period_${period.pk}`, 'data-type': type}).text(period.fields.period);
                        dropdownMenu_period.append(dropdownElement_period)
                    })

                    rowWrapper_period.append(rowInput_period, dropdownMenu_period)
                }

                if (general) {
                    dropdownMenu.append($('<li>').addClass('dropdownElement dropdownElement--choiceGroupModal')
                    .attr({'data-id': `general`, 'data-type': 'subject'}).text('Общие'))
                }

                rowWrapper.append(rowInput, dropdownMenu)

                choiceGroupModal.append(
                    closeChoiceGroupModal,
                    labelFirstChoiceGroup,
                );

                const manager = localStorage.getItem('manager')

                if (!manager) {
                    choiceGroupModal.append(rowWrapper)
                }
                
                if (period_flag) {
                    choiceGroupModal.append(rowWrapper_period)

                    var readyBtn = $('<div>', {
                        'class': 'adminTablesBtn addBtn addBtn--choicePeriodGroupBtn',
                        'text': 'Готово',
                        'data-type': 'choicePeriodGroupBtn'
                    })

                    choiceGroupModal.append(readyBtn)
                }

                $('body').append(choiceGroupModal)
                $('.overlay').show()
            
        })
        .catch((error) => {
            console.error(error)
        })

    })
    .catch((error) => {
        console.error(error)
    })
}


// Отображение шапки таблицы
function render_header(rowsWrapper, header_el=Array('ФИО', 'Группа'), long=true, grades=false) {
    var longRowWrapper = $('<div>', {
        'class': 'longRowWrapper tableHeader',
        'data-id': 'none',
    })

    var deleteLongRowWrapper = $('<div>', {
        'class': 'deleteLongRowWrapper',
    })

    header_el.forEach((elem, index) => {
        var rowWrapper = $('<div>', {
            'class': long ? 'rowWrapper rowWrapper--long' : 'rowWrapper',
        }).text(elem)

        if (grades) {
            var rowWrapper = $('<div>', {
                'class': 'rowWrapper rowWrapper--long--grades ',
            }).text(elem)
        }

        var rowInput = $('<input>', {
            'type': 'text',
            'class': 'rowInput rowInputHidden',
        })

        var addSubject = $('<img>', {
            'src': '/static/img/plus.svg',
            'class': 'addSubjectBtn'
        })

        var deleteSubject = $('<img>', {
            'src': '/static/img/delete.svg',
            'class': 'deleteSubjectBtn',
            'data-subject': elem
        })

        rowWrapper.append(rowInput)
        
        if (!['Студент', 'Период'].includes(elem) && localStorage.getItem('period_id')) {
            rowWrapper.append(deleteSubject)
        }

        deleteLongRowWrapper.append(rowWrapper)
        if (header_el.length == index+1 && localStorage.getItem('period_id')) {
            rowWrapper.append(addSubject)
        }
    })

    longRowWrapper.append(deleteLongRowWrapper)
    rowsWrapper.append(longRowWrapper)
}

// Удаление элемента из БД
$(document).on('click', '.deleteRow', function() {
    if ($(this).closest('.longRowWrapper').length > 0) {
        let parent = $(this).closest('.longRowWrapper')
        let type = parent.attr('data-id').split('_')[0]
        let id = parent.attr('data-id').split('_')[1]

        switch(type) {
            case 'student':
                request(`remove_student/${id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    parent.remove()
                })
                .catch((error) => {
                    console.error(error)
                })
                break

            case 'manager':
                request(`remove_manager/${id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    parent.remove()
                })
                .catch((error) => {
                    console.error(error)
                })
                break

            case 'subject':
                request(`remove_subject/${id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    parent.remove()
                })
                .catch((error) => {
                    console.error(error)
                })
                break

            case 'grade':
                request(`remove_grade/${id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    parent.remove()
                })
                .catch((error) => {
                    console.error(error)
                })
                break

            case 'group':
                request(`remove_group/${id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    parent.remove()
                })
                .catch((error) => {
                    console.error(error)
                })
                break
        }

        if ($('.longRowWrapper').length == 2) {
            $('.tableHeader').remove()
        }

        return
    }

    let parent = $(this).closest('.rowWrapper')
    let type = parent.attr('data-id').split('_')[0]
    let id = parent.attr('data-id').split('_')[1]
    switch(type) {
        case 'specialization':
            request(`remove_specialization/${id}`)
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                parent.remove()
            })
            .catch((error) => {
                console.error(error)
            })
            break

        case 'period':
            request(`remove_period/${id}`)
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                parent.remove()
            })
            .catch((error) => {
                console.error(error)
            })
            break
    }

});

// Удаление предмета
$(document).on('click', '.deleteSubjectBtn', function() {
    const subject_name = $(this).attr('data-subject')
    const period_id = localStorage.getItem('period_id')
    const group_id = localStorage.getItem('group_id')
    
    request(`remove_grade/${subject_name}/${period_id}/${group_id}`)
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        $('.adminTables').remove()
        render_group_grades(group_id, period_id)

    })
    .catch((error) => {
        console.error(error)
    })
})


// Добавление записи в БД
$(document).on('click', '.addBtn', function() {
    let type = $(this).attr('data-type')

    // Запрос в БД
    request('get_groups')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }

        var all_groups = response.groups
        switch(type) {
            case 'specializations':
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper rowWrapper--long',
                    'data-id': `none`
                })
    
                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                })
    
                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })
    
                rowWrapper.append(rowInput, deleteIcon)
                $('.rowsWrapper').append(rowWrapper)
    
                rowInput.focus()
                rowInput.on('blur', function(event) {
                    let value = $(this).val() 
                    if (!value) {
                        $(this).closest('.rowWrapper').remove();
                        return
                    }

                    request('add_specializations', {'name': value}, 'POST')
                    .then((response) => {
                        if (!response) {
                            console.error('Неизвестная ошибка')
                            return false
                        }
    
                        if (response.success) {
                            $(this).closest('.rowWrapper').attr('data-id', `specialization_${response.new_specialization_id}`)
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                });
    
                break

            case 'group': 
                if (!($('.longRowWrapper').length > 0)) {
                    render_header($('.rowsWrapper'), Array('Группа', 'Специальность'), long=true)
                    $('.rowsWrapper').append(longRowWrapper)
                }

                request('get_specializations')
                    .then((response) => {
                        if (!response) {
                            console.error('Неизвестная ошибка')
                            return false
                        }

                        const all_specializations = JSON.parse(response.specializations)
                    
                        if (all_specializations.length == 0) {
                            alert('Добавьте хотя бы одну запись в таблицу "Специальности"')
                            return
                        }
                    
                        var longRowWrapper = $('<div>', {
                            'class': 'longRowWrapper',
                            'data-id': `none`,
                        })

                        var deleteLongRowWrapper = $('<div>', {
                            'class': 'deleteLongRowWrapper',
                        })
                        
                        var rowWrapper = $('<div>', {
                            'class': 'rowWrapper rowWrapper--long',
                        })

                        var dropdown_list = $('<div>', {
                            'class': 'rowWrapper dropdown-list'
                        })

                        var dropdown_menu = $('<ul>', {
                            'class': 'dropdown-menu'
                        })

                        dropdown_menu.append($('<li>', {
                            'class': 'dropdownElement dropdownFirstElement'
                        }))

                        all_specializations.forEach((specialization) => {
                            var dropdownElement = $('<li>', {
                                'class': 'dropdownElement',
                                'data-id': `specializations_${specialization.pk}`
                            }).text(specialization.fields.name)

                            dropdown_menu.append(dropdownElement)
                        })

                        var rowInput = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                        })

                        var dropdownInput = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                            'value': all_specializations[0].fields.name,
                            'data-id': 'specializations_' + all_specializations[0].pk,
                            'readonly': true
                        })

                        var deleteIcon = $('<img>', {
                            'class': 'deleteRow',
                            'src': staticUrl + 'img/delete.svg',
                        })

                        dropdown_list.append(dropdownInput, dropdown_menu)
                        rowWrapper.append(rowInput)
                        deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                        longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                        $('.rowsWrapper').append(longRowWrapper)

                        rowInput.focus()
                        rowInput.on('blur', function(event) {
                            let value = $(this).val() 
                            if (!value) {
                                longRowWrapper.remove();

                                if ($('.longRowWrapper').length == 1) {
                                    $('.longRowWrapper').remove()
                                }
                                return
                            }

                            request('add_group', {'group_name': value, 'specialization_id': all_specializations[0].pk}, 'POST')
                            .then((response) => {
                                if (!response) {
                                    console.error('Неизвестная ошибка')
                                    return false
                                }

                                if (response.success) {
                                    $(this).closest('.longRowWrapper').attr('data-id', `group_${response.new_group_id}`)
                                }
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                        });
                    })

                    .catch((error) => {
                        console.error(error)
                    })
                break
    
            case 'subject':
                request('get_specializations')
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    const all_groups = JSON.parse(response.specializations)

                    if (!($('.longRowWrapper').length > 0)) {
                        render_header($('.rowsWrapper'), Array('Предмет', 'Специальность'), long=true)
                        $('.rowsWrapper').append(longRowWrapper)
                    }

                    if (all_groups.length == 0) {
                        alert('Добавьте хотя бы одну запись в таблицу "Специальности"')
                        return
                    }
                
                    var longRowWrapper = $('<div>', {
                        'class': 'longRowWrapper',
                        'data-id': `none`,
                    })

                    var deleteLongRowWrapper = $('<div>', {
                        'class': 'deleteLongRowWrapper',
                    })
                    
                    var rowWrapper = $('<div>', {
                        'class': 'rowWrapper rowWrapper--long',
                    })

                    var dropdown_list = $('<div>', {
                        'class': 'rowWrapper dropdown-list'
                    })

                    var dropdown_menu = $('<ul>', {
                        'class': 'dropdown-menu'
                    })

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement dropdownFirstElement'
                    }))

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `general`
                    }).text('Общие'))


                    all_groups.forEach((group) => {
                        var dropdownElement = $('<li>', {
                            'class': 'dropdownElement',
                            'data-id': `group_${group.pk}`
                        }).text(group.fields.name)

                        dropdown_menu.append(dropdownElement)
                    })

                    var rowInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                    })

                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': 'Общие',
                        'data-id': `general`,
                        'readonly': true
                    })

                    var deleteIcon = $('<img>', {
                        'class': 'deleteRow',
                        'src': staticUrl + 'img/delete.svg',
                    })

                    dropdown_list.append(dropdownInput, dropdown_menu)
                    rowWrapper.append(rowInput)
                    deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                    $('.rowsWrapper').append(longRowWrapper)
        
                    rowInput.focus()
                    rowInput.on('blur', function(event) {
                        let value = $(this).val() 
                        if (!value) {
                            longRowWrapper.remove();

                            if ($('.longRowWrapper').length == 1) {
                                $('.longRowWrapper').remove()
                            }
                            return
                        }
                        
                        request('add_subject', {'subject_name': value}, 'POST')
                        .then((response) => {
                            if (!response) {
                                console.error('Неизвестная ошибка')
                                return false
                            }
        
                            if (response.success) {
                                $(this).closest('.longRowWrapper').attr('data-id', `subject_${response.new_subject_id}`)
                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                    });
                })
            .catch((error) => {
                console.error(error)
            })
    
                
                break

            case 'period': 
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper',
                    'data-id': `none`
                })
    
                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                })
    
                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })
    
                rowWrapper.append(rowInput, deleteIcon)
                $('.rowsWrapper').append(rowWrapper)
    
                rowInput.focus()
                rowInput.on('blur', function(event) {
                    let value = $(this).val() 
                    if (!value) {
                        $(this).closest('.rowWrapper').remove();
                        return
                    }
                    
                    request('add_period', {'period': value}, 'POST')
                    .then((response) => {
                        if (!response) {
                            console.error('Неизвестная ошибка')
                            return false
                        }
    
                        if (response.success) {
                            $(this).closest('.rowWrapper').attr('data-id', `period_${response.new_period_id}`)
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                });
    
                break

            case 'student':
                var group_id = ''
                const manager = localStorage.getItem('manager')
                request('get_group_for_student_name/' + manager)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    group_id = response.group_id

                    if (manager) {
                        var new_groups = [...all_groups]
                        new_groups = new_groups.forEach((item) => {
                            if (item.id == group_id) {
                                all_groups = [item]
                            }
                        })
                    }
    
                    if (all_groups.length == 0) {
                        alert('Добавьте хотя бы одну запись в таблицу "Группы"')
                        return
                    }
    
                    var longRowWrapper = $('<div>', {
                        'class': 'longRowWrapper',
                        'data-id': 'student',
                    })
        
                    var deleteLongRowWrapper = $('<div>', {
                        'class': 'deleteLongRowWrapper',
                    })
        
                    var rowWrapper = $('<div>', {
                        'class': 'rowWrapper rowWrapper--long',
                    })
        
                    var dropdown_list = $('<div>', {
                        'class': 'rowWrapper dropdown-list'
                    })
        
                    var dropdown_menu = $('<ul>', {
                        'class': 'dropdown-menu'
                    })
        
                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement dropdownFirstElement'
                    }))
                    
                    all_groups.forEach((group) => {
                        var dropdownElement = $('<li>', {
                            'class': 'dropdownElement',
                            'data-id': `group_${group.id}`
                        }).text(group.group_name)
        
                        dropdown_menu.append(dropdownElement)
                    })
        
                    var rowInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                    })
        
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': all_groups[0].group_name,
                        'data-id': `group_${all_groups[0].id}`
                    })
        
                    var deleteIcon = $('<img>', {
                        'class': 'deleteRow',
                        'src': staticUrl + 'img/delete.svg',
                    })
    
                    dropdown_list.append(dropdownInput, dropdown_menu)
                    rowWrapper.append(rowInput)
                    deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
    
                    if ($('.longRowWrapper').length > 0) {
                        $('.rowsWrapper').append(longRowWrapper)
                    }
    
                    else {
                        render_header($('.rowsWrapper'), Array('ФИО', 'Группа'))
                        $('.rowsWrapper').append(longRowWrapper)
                    }
    
                    rowInput.focus()
                    rowInput.on('blur', function(event) {
                        let value = $(this).val() 
                        if (!value) {
                            $(this).closest('.longRowWrapper').remove();
    
                            longRowWrapper.remove();
                            if ($('.longRowWrapper').length == 1) {
                                $('.longRowWrapper').remove()
                            }
                            return
                        }
                        
                        var group_id = $(this).closest('.longRowWrapper').find('.dropdown-list').find('.rowInput').attr('data-id').split('_')[1]
                        request('add_student', {'fullname': value, 'group_id': group_id}, 'POST')
                        .then((response) => {
                            if (!response) {
                                console.error('Неизвестная ошибка')
                                return false
                            }
        
                            if (response.success) {
                                $(this).closest('.longRowWrapper').attr('data-id', `student_${response.new_student_id}`)
                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                    });
    
                    

                })
                .catch((error) => {
                    console.error(error)
                })

                break
                

            case 'manager':
                // Запрос в БД "Студенты"
                request(('get_students'))
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    all_students = response.students

                    // Отрисовка новой записи "Старосты"
                    if (all_groups.length == 0 || all_students.length == 0) {
                        alert('Добавьте хотя бы одну запись в таблицы "Студенты" и "Группы"')
                    }
                    add_manager(all_students, all_groups)

                })
                .catch((error) => {
                    console.error(error)
                })
                break

            case 'grade':
                request(('get_students'))
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }
                    all_students = response.students

                    request(('get_periods'))
                    .then((response) => {
                        if (!response) {
                            console.error('Неизвестная ошибка')
                            return false
                        }
                        var all_periods = JSON.parse(response.periods)

                        request(('get_subjects'))
                        .then((response) => {
                            if (!response) {
                                console.error('Неизвестная ошибка')
                                return false
                            }
                            var all_subjects = response.subjects

                            if (all_periods.length == 0 || all_students.length == 0 || all_subjects.length == 0) {
                                alert('Добавьте хотя бы одну запись в таблицы "Студенты"/"Периоды"/"Предметы"')
                            }

                            // Отрисовка новой записи "Оценки"
                            add_grade(all_students, all_periods, all_subjects)

                        })
                        .catch((error) => {
                            console.error(error)
                        })

                    })
                    .catch((error) => {
                        console.error(error)
                    })
                })
                .catch((error) => {
                    console.error(error)
                })
                break
        }
    })
    .catch((error) => {
        console.error(error)
    })
})


// Поиск группы студента по ID студента
function findGroupId(studentId, data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].student.id === studentId) {
            return data[i].group.id;
        }
    }
    return null;
}


// Обновление записи в БД, при focus/unfocus
$(document).on('focus', '.rowInput', function() {
    var $inputElement = $(this);
    $inputElement.data('originalValue', $inputElement.val());

    $('.rowInput').removeClass('selectRowInput')
    $inputElement.addClass('selectRowInput')
});

$(document).on('blur', '.rowInput', function() {
    var $inputElement = $(this);
    var originalValue = $inputElement.data('originalValue');
    var currentValue = $inputElement.val();
    $('.rowInput').removeClass('selectRowInput')
    
    // Запрос в БД
    if (originalValue !== currentValue) {
        try {
            var parent = $inputElement.closest('.rowWrapper')
            var elem_id = parent.attr('data-id').split('_')[1]
            var type = parent.attr('data-id').split('_')[0]
        }
        catch {
            var parent = $inputElement.closest('.longRowWrapper')
            var elem_id = parent.attr('data-id').split('_')[1]
            var type = parent.attr('data-id').split('_')[0]
        }
            
        switch(type) {
            case 'specialization':
                request(
                    'update_specializations',
                    {
                        id: elem_id,
                        new_value: currentValue
                    },
                    'POST'
                )
                break

            case 'group':
                specialization_id = parent.find('[data-id^="specialization"]').attr('data-id').split('_')[1]
                request(
                    'update_group',
                    {
                        id: elem_id,
                        new_value: currentValue,
                        specialization_id: specialization_id
                    },
                    'POST'
                )
                break

            case 'subject':
                const specialization_id = parent.find('.dropdown-list').find('.rowInput').attr('data-id').split('_')[1]

                request(
                    'update_subject',
                    {
                        id: elem_id,
                        new_value: currentValue,
                        specialization_id: specialization_id,


                    },
                    'POST'
                )
                break

            case 'period':
                request(
                    'update_period',
                    {
                        id: elem_id,
                        new_value: currentValue
                    },
                    'POST'
                )
                break
            
            case 'student':
                request(
                    'update_student',
                    {
                        student_id: elem_id,
                        fullname: currentValue,
                        group_id: parent.find('.dropdown-list').find('.rowInput').attr('data-id').split('_')[1]
                    },
                    'POST'
                )
                break

            case 'manager':
                var student_id = parent.find('[data-id^="student"]').attr('data-id').split('_')[1]
                const group_id = parent.find('[data-id^="group"]').attr('data-id').split('_')[1]
                const login = parent.find('[data-id="login"]').val()
                const password = parent.find('[data-id="password"]').val()

                request(
                    'update_manager',
                    {
                        manager_id: elem_id,
                        student_id: student_id,
                        group_id: group_id,
                        login: login,
                        password: password,
                    },
                    'POST'
                )
                break

            case 'grade':
                let grade_id = elem_id
                var student_id = parent.find('[data-id^="student"]').attr('data-id').split('_')[1]
                let period_id = parent.find('[data-id^="period"]').attr('data-id').split('_')[1]
                let subjects_inputs = parent.find('[data-id^="subject"]');
                let grades = subjects_inputs.map(function(index, item) {
                    return {
                        subject_name: $(item).attr('data-id').split('_')[1],
                        grade: $(item).val()
                    };
                }).get();

                var sendData = {
                    period_id,
                    student_id,
                    grade_id,
                    grades: JSON.stringify(grades),
                }

                request(
                    'update_grade',
                    sendData,
                    'POST'
                )
                break
        }
    }
});

// Выбор элемента в списке
$(document).on('click', '.dropdownElement', function() {
    // Видимые изменения
    if ($(this).hasClass('dropdownFirstElement')) return

    $(this).parent().find('.dropdownElement').removeClass('dropdownCurrentElement')
    $(this).addClass('dropdownCurrentElement')
    $(this).closest('.rowWrapper').find('.rowInput').val($(this).html())
    $(this).closest('.rowWrapper').find('.rowInput').attr({'data-id': $(this).attr('data-id')})

    // Запрос на обновление в БД
    try {
        type = $(this).closest('.longRowWrapper').attr('data-id').split('_')[0]
    }
    catch (error) {
        console.error(error)
        type = ''
    }

    // Выбор студента (фильтр в отчёте)
    if ($(this).attr('data-id').split('_')[0] == 'filterStudent') {
        const student_id = $(this).attr('data-id').split('_')[1]
        const period_id = $(this).closest('.inputReportWrapper').find('.reportDropdownList').find('.rowInput').attr('data-id').split('_')[1]
        const group_name = $(this).closest('.inputReportWrapper').find('#groupInput').val()
        request(`get_report_for_student/${student_id}/${period_id}/${group_name}`)
        .then((response) => {
            if (response.success) {
                const student_data = response.grades
                $('.reportModal').find('.rowsWrapper').remove()
                $('.reportModal').find('.reportPrintBtn').remove()
                // Запрос на одного студента по всем периодам
                render_data_report(student_data)
            }
        })
        .catch((error) => {
            console.error(error)
        })
        return        
    }
    
    

    // Выбор группы в модальном окне
    if ($(this).hasClass('dropdownElement--choiceGroupModal')) {
        if ($('.addBtn--choicePeriodGroupBtn').length > 0) {
            return
        }

        let group_id = $(this).attr('data-id').split('_')[1]
        let type_group = $(this).attr('data-type')

        closeChoiceGroupModal()
        $('.adminTables').remove()
        
        switch(type_group) {
            case 'student':
                render_group_students(group_id)
                break

            case 'subject':
                render_group_subjects(group_id)
                break

            case 'grades':
                // Получение всех оценок по group_id и period_id
                const period_id = localStorage.getItem('period_id')
                const group_id_ = localStorage.getItem('group_id')
                request(`get_grades_for_group/${group_id_}/${period_id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    const all_grades = response.grades
                    // Получение из оценок JsonField
                    var grades = all_grades[0].grades

                    // Получение названия выбранного предмета
                    const subject_name = $(this).text() 

                    // Вставка в JsonField
                    if (grades) {
                        grades.push({
                            'subject_name': subject_name,
                            'grade': ''
                        })
                    }
                    else {
                        grades = [
                            {
                                'subject_name': subject_name,
                                'grade': ''
                            }
                        ]
                    }
                   

                    var sendData = {
                        'newGrades': JSON.stringify(grades),
                        'group_id': group_id_,
                        'period_id': period_id,
                    }

                    // Обновление JsonField у всех Grades, по group_id и period_id
                    request(`update_grades_for_group`, sendData, 'POST')
                    .then((response) => {
                        if (!response) {
                            console.error('Неизвестная ошибка')
                            return false
                        }
                        render_group_grades(group_id_, period_id)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                })
                .catch((error) => {
                    console.error(error)
                })

                
                break
        }
        return
    }

    // Выбор периода в отчёте
    else if ($(this).hasClass('dropdownElement--reportChoicePeriod')) {
        let period_id = $(this).attr('data-id').split('_')[1];
        const manager = localStorage.getItem('manager');
        let group_name = '';
    
        const getGroupName = async () => {
            if (manager) {
                try {
                    const response = await request('get_group_for_student_name/' + manager);
                    if (!response) {
                        console.error('Неизвестная ошибка');
                        return false;
                    }
                    return response.group_name;
                } catch (error) {
                    console.error(error);
                    return '';
                }
            } else {
                return $('#groupInput').val() || 'all';
            }
        };
    
        (async () => {
            group_name = await getGroupName();
    
            if (group_name === 'all' && !manager) {
                return alert('Выберите группу');
            }
    
            try {
                const response = await request(`get_report/${group_name}/${period_id}`);
                if (response.success) {
                    $('.reportModal').find('.rowsWrapper').remove();
                    $('.reportModal').find('.reportPrintBtn').remove();
                    render_data_report(response.grades);
    
                    if (group_name === 'all') {
                        $('.reportModalTitle').text(`Отчёт по всем группам`);
                    } else {
                        $('.reportModalTitle').text(`Отчёт по группе ${group_name}`);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        })();

        return
    }
    switch(type) {
        case 'student':
            var group_id = $(this).attr('data-id').split('_')[1]
            var student_id = $(this).closest('.longRowWrapper').attr('data-id').split('_')[1]
            var fullname = $(this).closest('.longRowWrapper').find('.rowInput').first().val()

            request(
                'update_student',
                {
                    student_id: student_id,
                    fullname: fullname,
                    group_id: group_id
                },
                'POST'
            )
            
            break

        case 'manager':
            var student_id = $(this).closest('.longRowWrapper').find('[data-id^="student"]').attr('data-id').split('_')[1]
            var group_id = $(this).closest('.longRowWrapper').find('[data-id^="group"]').attr('data-id').split('_')[1]
            var login = $(this).closest('.longRowWrapper').find('[data-id="login"]').val()
            var password = $(this).closest('.longRowWrapper').find('[data-id="password"]').val()

            request(
                'update_manager',
                {
                    manager_id: $(this).closest('.longRowWrapper').attr('data-id').split('_')[1],
                    student_id: student_id,
                    group_id: group_id,
                    login: login,
                    password: password,
                },
                'POST'
            )
            break

        case 'grade':
            break

        case 'subject':
            var subject_id = $(this).closest('[data-id^="subject"]').attr('data-id').split('_')[1]
            var specialization_id = $(this).attr('data-id').split('_')[1]
            var subject_name = $(this).closest('.longRowWrapper').find('.rowInput').first().val()
            request(
                'update_subject',
                {
                    id: subject_id,
                    specialization_id: specialization_id,
                    new_value: subject_name,
                },
                'POST'
            )
            break

        case 'group':
            var elem_id = $(this).closest('.longRowWrapper').attr('data-id').split('_')[1]
            var specialization_id = $(this).closest('.longRowWrapper').find('[data-id^="specialization"]').attr('data-id').split('_')[1]
            var currentValue = $(this).closest('.longRowWrapper').find('.rowInput').val()

            request(
                'update_group',
                {
                    id: elem_id,
                    new_value: currentValue,
                    specialization_id: specialization_id
                },
                'POST'
            )
            break   
    }
})


// Раскрытие списка
$(document).on('click', '.dropdown-list', function() {
    try {
        if ($(this).closest('.longRowWrapper').attr('data-id').split('_')[0] == 'grade') {
            return
        }
    }
    catch {}

    // Видимые изменения
    $('.dropdown-menu').not($(this).find('.dropdown-menu')).removeClass('dropdown-menu--show')
    $('.rowInput').css('z-index', 1)

    $('.rowInput').css('z-index', 0)
    $(this).find('.rowInput').css('z-index', 2)
    $(this).find('.dropdown-menu').toggleClass('dropdown-menu--show')


    // Получение данных из БД и рендер
})


// Отрисовка новой записи в таблице "Менеджер"
function add_manager(all_students, all_groups) {
    var longRowWrapper = $('<div>', {
        'class': 'longRowWrapper',
        'data-id': `none`,
    })

    var deleteLongRowWrapper = $('<div>', {
        'class': 'deleteLongRowWrapper',
    })
    
    // rowWrapper
    var rowWrapper_login = $('<div>', {
        'class': 'rowWrapper',
    })

    var rowWrapper_password = $('<div>', {
        'class': 'rowWrapper',
    })

    // dropdown_list
    var dropdown_list_student = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })

    var dropdown_list_group = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })


    // dropdown_menu
    var dropdown_menu_student = $('<ul>', {
        'class': 'dropdown-menu'
    })

    var dropdown_menu_group = $('<ul>', {
        'class': 'dropdown-menu'
    })

    dropdown_menu_student.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))

    dropdown_menu_group.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))


    all_groups.forEach((group) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `group_${group.id}`
        }).text(group.group_name)

        dropdown_menu_group.append(dropdownElement)
    })


    all_students.forEach((student) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `student_${student.student.id}`
        }).text(student.student.fullname)

        dropdown_menu_student.append(dropdownElement)
    })

    // Row input
    var rowInput_student = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'data-id': `student_${all_students[0].student.id}`,
        'value': all_students[0].student.fullname,
        'readonly': true,
    })

    var rowInput_group = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'value': all_groups[0].group_name,
        'data-id': `group_${all_groups[0].id}`,
        'readonly': true,
    })

    var rowInput_login = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'data-id': 'login',
    })

    var rowInput_password = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'data-id': 'password',
    })

    dropdown_list_student.append(rowInput_student, dropdown_menu_student)
    dropdown_list_group.append(rowInput_group, dropdown_menu_group)
    rowWrapper_login.append(rowInput_login)
    rowWrapper_password.append(rowInput_password)

    var deleteIcon = $('<img>', {
        'class': 'deleteRow',
        'src': staticUrl + 'img/delete.svg',
    })

    deleteLongRowWrapper.append(dropdown_list_student, dropdown_list_group, rowWrapper_login, rowWrapper_password)
    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)

    if ($('.longRowWrapper').length > 0) {
        $('.rowsWrapper').append(longRowWrapper)
    }

    else {
        render_header($('.rowsWrapper'), Array('Студент', 'Группа', 'Логин', 'Пароль'), long=false)
        $('.rowsWrapper').append(longRowWrapper)
    }


    rowInput_login.focus()
    rowInput_login.on('blur', function(event) {
            if ($(this).val().length > 0) {
                var group_id = $(this).closest('.longRowWrapper').find('[data-id^="group"]').attr('data-id').split('_')[1]
                var student_id = $(this).closest('.longRowWrapper').find('[data-id^="student"]').attr('data-id').split('_')[1]
                var login = $(this).closest('.longRowWrapper').find('[data-id^="login"]').val()
                var password = $(this).closest('.longRowWrapper').find('[data-id^="password"]').val()

                var send_data = {
                    'student_id': student_id, 
                    'group_id': group_id,
                    'login': login,
                    'password': password 
                }

                request('add_manager', send_data, 'POST')
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    if (response.success) {
                        $(this).closest('.longRowWrapper').attr('data-id', `manager_${response.new_manager_id}`)
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
            } else {
                longRowWrapper.remove();
                if ($('.longRowWrapper').length == 1) {
                    $('.longRowWrapper').remove()
                }
            }
    });
}

// Отрисовка новой записи в таблице "Пропуски"
function add_skipping(all_students, all_periods) {
    var longRowWrapper = $('<div>', {
        'class': 'longRowWrapper',
        'data-id': `none`,
    })

    var deleteLongRowWrapper = $('<div>', {
        'class': 'deleteLongRowWrapper',
    })

    var rowWrapper_valid = $('<div>', {
        'class': 'rowWrapper',
    })

    var rowWrapper_invalid = $('<div>', {
        'class': 'rowWrapper',
    })

    var rowWrapper_all = $('<div>', {
        'class': 'rowWrapper',
    })

    // dropdown_list
    var dropdown_list_student = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })

    var dropdown_list_period = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })


    // dropdown_menu
    var dropdown_menu_student = $('<ul>', {
        'class': 'dropdown-menu'
    })

    var dropdown_menu_period = $('<ul>', {
        'class': 'dropdown-menu'
    })

    dropdown_menu_student.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))

    dropdown_menu_period.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))


    all_periods.forEach((period) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `period_${period.pk}`
        }).text(period.fields.period)

        dropdown_menu_period.append(dropdownElement)
    })


    all_students.forEach((student) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `student_${student.student.id}`
        }).text(student.student.fullname)

        dropdown_menu_student.append(dropdownElement)
    })


    // Row input
    var rowInput_student = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'data-id': `student_${all_students[0].student.id}`,
        'value': all_students[0].student.fullname,
        'readonly': true,
    })

    var rowInput_period = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'value': all_periods[0].fields.period,
        'data-id': `period_${all_periods[0].pk}`,
        'readonly': true,
    })

    var rowInput_valid = $('<input>', {
        'type': 'number',
        'class': 'rowInput',
        'data-id': 'valid',
        'value': 0
    })

    var rowInput_invalid = $('<input>', {
        'type': 'number',
        'class': 'rowInput',
        'data-id': 'invalid',
        'value': 0
    })

    var rowInput_all = $('<input>', {
        'type': 'number',
        'class': 'rowInput',
        'data-id': 'all',
        'readonly': true,
        'value': 0
    })
    

    dropdown_list_student.append(rowInput_student, dropdown_menu_student)
    dropdown_list_period.append(rowInput_period, dropdown_menu_period)
    rowWrapper_valid.append(rowInput_valid)
    rowWrapper_invalid.append(rowInput_invalid)
    rowWrapper_all.append(rowInput_all)

    var deleteIcon = $('<img>', {
        'class': 'deleteRow',
        'src': staticUrl + 'img/delete.svg',
    })

    deleteLongRowWrapper.append(dropdown_list_student, dropdown_list_period, rowWrapper_valid, rowWrapper_invalid, rowWrapper_all)
    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)

    if ($('.longRowWrapper').length > 0) {
        $('.rowsWrapper').append(longRowWrapper)
    }

    else {
        render_header($('.rowsWrapper'), Array('Студент', 'Период', 'Уваж.', 'Неуваж.', 'Всего'), long=false)
        $('.rowsWrapper').append(longRowWrapper)
    }


    rowInput_valid.focus()
    rowInput_valid.on('blur', function(event) {
        if ($(this).val().length > 0) {
            var period_id = $(this).closest('.longRowWrapper').find('[data-id^="period"]').attr('data-id').split('_')[1]
            var student_id = $(this).closest('.longRowWrapper').find('[data-id^="student"]').attr('data-id').split('_')[1]
            var valid_skipping = $(this).closest('.longRowWrapper').find('[data-id^="valid"]').val()
            var invalid_skipping = $(this).closest('.longRowWrapper').find('[data-id^="invalid"]').val()
            var all_skipping = $(this).closest('.longRowWrapper').find('[data-id^="all"]').val()

            var send_data = {
                'student_id': student_id, 
                'period_id': period_id,
                'valid_skipping': valid_skipping,
                'invalid_skipping': invalid_skipping,
                'all_skipping': all_skipping,
            }

            request('add_skipping', send_data, 'POST')
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }

                location.reload()
            })
            .catch((error) => {
                console.error(error)
            })
        } else {
            longRowWrapper.remove();
        }
});
}

// Отрисовка новой записи в таблице "Пропуски"
function add_grade(all_students, all_periods, all_subjects) {
    var longRowWrapper = $('<div>', {
        'class': 'longRowWrapper',
        'data-id': `none`,
    })

    var deleteLongRowWrapper = $('<div>', {
        'class': 'deleteLongRowWrapper',
    })
    
    // rowWrapper
    var rowWrapper_grade = $('<div>', {
        'class': 'rowWrapper',
    })

    // dropdown_list
    var dropdown_list_student = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })

    var dropdown_list_period = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })

    var dropdown_list_subject = $('<div>', {
        'class': 'rowWrapper dropdown-list'
    })


    // dropdown_menu
    var dropdown_menu_student = $('<ul>', {
        'class': 'dropdown-menu'
    })

    var dropdown_menu_period = $('<ul>', {
        'class': 'dropdown-menu'
    })

    var dropdown_menu_subject = $('<ul>', {
        'class': 'dropdown-menu'
    })

    dropdown_menu_student.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))

    dropdown_menu_period.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))

    dropdown_menu_subject.append($('<li>', {
        'class': 'dropdownElement dropdownFirstElement'
    }))


    all_periods.forEach((period) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `period_${period.pk}`
        }).text(period.fields.period)

        dropdown_menu_period.append(dropdownElement)
    })

    all_students.forEach((student) => {
        var dropdownElement = $('<li>', {
            'class': 'dropdownElement',
            'data-id': `student_${student.student.id}`
        }).text(student.student.fullname)

        dropdown_menu_student.append(dropdownElement)
    })

    // Отображение общих предметов и предметов, подвязанных к группе
    all_subjects.forEach((subject) => {
        if (!subject.group.group_id || subject.group.group_id == findGroupId(all_students[0].student.id, all_students)) {
            var dropdownElement = $('<li>', {
                'class': 'dropdownElement',
                'data-id': `subject_${subject.id}`
            }).text(subject.subject_name)

            dropdown_menu_subject.append(dropdownElement)
        }
    })


    // Row input
    var rowInput_student = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'data-id': `student_${all_students[0].student.id}`,
        'value': all_students[0].student.fullname,
        'readonly': true,
    })

    var rowInput_period = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'value': all_periods[0].fields.period,
        'data-id': `period_${all_periods[0].pk}`,
        'readonly': true,
    })

    var rowInput_subject = $('<input>', {
        'type': 'text',
        'class': 'rowInput',
        'value': all_subjects[0].subject_name,
        'data-id': `subject_${all_subjects[0].id}`,
        'readonly': true,
    })

    var rowInput_grade = $('<input>', {
        'type': 'number',
        'class': 'rowInput',
        'data-id': 'grade',
    })
    

    dropdown_list_student.append(rowInput_student, dropdown_menu_student)
    dropdown_list_period.append(rowInput_period, dropdown_menu_period)
    dropdown_list_subject.append(rowInput_subject, dropdown_menu_subject)
    rowWrapper_grade.append(rowInput_grade)

    var deleteIcon = $('<img>', {
        'class': 'deleteRow',
        'src': staticUrl + 'img/delete.svg',
    })

    deleteLongRowWrapper.append(dropdown_list_student, dropdown_list_subject, rowWrapper_grade, dropdown_list_period)
    longRowWrapper.append(deleteLongRowWrapper, deleteIcon)

    if ($('.longRowWrapper').length > 0) {
        $('.rowsWrapper').append(longRowWrapper)
    }

    else {
        render_header($('.rowsWrapper'), Array('Студент', 'Предмет', 'Оценка.', 'Период'), long=false)
        $('.rowsWrapper').append(longRowWrapper)
    }


    rowInput_grade.focus()
    rowInput_grade.on('blur', function(event) {
        if ($(this).val().length > 0) {
            var period_id = $(this).closest('.longRowWrapper').find('[data-id^="period"]').attr('data-id').split('_')[1]
            var student_id = $(this).closest('.longRowWrapper').find('[data-id^="student"]').attr('data-id').split('_')[1]
            var subject_id = $(this).closest('.longRowWrapper').find('[data-id^="subject"]').attr('data-id').split('_')[1]
            var grade = $(this).closest('.longRowWrapper').find('[data-id^="grade"]').val()

            var send_data = {
                'student_id': student_id, 
                'period_id': period_id,
                'subject_id': subject_id,
                'grade': grade
            }

            request('add_grade', send_data, 'POST')
            .then((response) => {
                if (!response) {
                    console.error('Неизвестная ошибка')
                    return false
                }
                
                if (response.success) {
                    $(this).closest('.longRowWrapper').attr('data-id', `grade_${response.new_grade_id}`)
                }
            })
            .catch((error) => {
                console.error(error)
            })
        } else {
            longRowWrapper.remove();
        }
});
}


// Подсчет поля "Всего"
$(document).on('input', '.rowInput', function() {
    let parent = $(this).closest('.longRowWrapper')
    let valid = parseInt(parent.find('[data-id="valid"]').val()) || 0
    let invalid = parseInt(parent.find('[data-id="invalid"]').val()) || 0

    parent.find('[data-id="all"]').val(valid + invalid)
})

// Закрытие отчёта
$(document).on('click', '.overlay, .closeButton', function() {
    $('.overlay').hide();
    $('.reportModal').remove();
});


// Закрытие модального окна выбора группы
$(document).on('click', '.overlay, .closeChoiceGroupModal', function() {
    closeChoiceGroupModal()
});

function closeChoiceGroupModal() {
    $('.overlay').hide();
    $('.choiceGroupModal').remove();
}

// Открытие отчёта
$(document).on('click', '.reportBtn', function() {
    $('.overlay').show()
    render_report()
})


// Отчёт по группе:
var timeoutId;

$(document).on('input', '#groupInput', function() {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(function() {
        let group_name = $('#groupInput').val() || 'all'
        let period_id = $('.reportDropdownList').find('.rowInput').attr('data-id').split('_')[1]

        if (group_name == 'all') {
            $('.reportModalTitle').text(`Выберите группу`)
            return
        }
        else {
            $('.reportModalTitle').text(`Отчёт по группе ${group_name}`)
        }

        request(`get_report/${group_name}/${period_id}`)
        .then((response) => {
            if (response.success) {
                $('.reportModal').find('.rowsWrapper').remove()
                $('.reportModal').find('.reportPrintBtn').remove()
                render_data_report(response.grades)

                // Добавление ещё одного фильтра (студентов)
                request(`get_students_for_group_name/${group_name}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    const all_students = response.students

                    var dropdown_list = $('<div>', {
                        'class': 'rowWrapper dropdown-list'
                    })
    
                    var dropdown_menu = $('<ul>', {
                        'class': 'dropdown-menu'
                    })
    
                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement dropdownFirstElement'
                    }))

                    dropdown_menu.append($('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `filterStudent_all`
                    }).text('Все'))
    
                    all_students.forEach((student) => {
                        var dropdownElement = $('<li>', {
                            'class': 'dropdownElement',
                            'data-id': `filterStudent_${student.student.id}`
                        }).text(student.student.fullname)
    
                        dropdown_menu.append(dropdownElement)
                    })
    
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': 'Все',
                        'id': 'filterStudent',
                        'data-id': `filterStudent_all`,
                        'readonly': true
                    })
                    dropdown_list.append(dropdownInput, dropdown_menu)
                    $('.inputReportWrapper').append($('<label>', {
                        'class': 'groupInputLabel'
                    }).text('Выберите студента'))
                    $('.inputReportWrapper').append(dropdown_list)
                })
                .catch((error) => {
                    console.error(error)
                })
                    
            }
        })
        .catch((error) => {
            console.error(error)
        })
    }, 500); 
});

// Отображение отчёта по данным 
function render_data_report(data) {
    var rowsWrapper = $('<div>').addClass('rowsWrapper');
 
    var longRowWrapperHeader = $('<div>').addClass('longRowWrapper tableHeader').attr('data-id', 'report');
    var deleteLongRowWrapperHeader = $('<div>').addClass('deleteLongRowWrapper');

    var rowHeaders = defineHeader(data)
    rowHeaders.splice(2, 0, "Дата");

    rowHeaders.forEach(function(headerText) {
        var rowWrapper = $('<div>').addClass('rowWrapper rowWrapper--long--grades').text(headerText);
        var input = $('<input>').attr({type: 'text', class: 'rowInput rowInputHidden', readonly: true});
        rowWrapper.append(input);
        deleteLongRowWrapperHeader.append(rowWrapper);
    });

    longRowWrapperHeader.append(deleteLongRowWrapperHeader);

    rowsWrapper.append(longRowWrapperHeader)
    data.forEach(function(reportItem) {
        var longRowWrapperItem = $('<div>').addClass('longRowWrapper').attr('data-id', 'reportItem');
        var deleteLongRowWrapperItem = $('<div>').addClass('deleteLongRowWrapper');

        Object.keys(reportItem).forEach(function(key) {
            if (key == 'grades') {
                reportItem[key].forEach((item) => {
                    var rowWrapper = $('<div>').addClass('rowWrapper rowWrapper--long--grades');
                    var input = $('<input>').attr({type: 'text', class: 'rowInput', readonly: true,'data-id': item.subject_name}).val(item.grade)
                    rowWrapper.append(input);
                    deleteLongRowWrapperItem.append(rowWrapper);
                })
            }
            else {
                var rowWrapper = $('<div>').addClass('rowWrapper rowWrapper--long--grades');
                var input = $('<input>').attr({type: 'text', class: 'rowInput', readonly: true}).val(reportItem[key]);
                rowWrapper.append(input);
                deleteLongRowWrapperItem.append(rowWrapper);
            }
        });

        longRowWrapperItem.append(deleteLongRowWrapperItem);
        rowsWrapper.append(longRowWrapperItem);
    });

    var reportPrintBtn = $('<div>').addClass('adminTablesBtn reportPrintBtn').text('Печать');

    $('.reportModal').append(rowsWrapper, reportPrintBtn);
}

// Печать отчёта
$(document).on('click', '.reportPrintBtn', function() {
    try {
        var group_name = $('#groupInput').val() || 'all'
        var student_id = $('#filterStudent').attr('data-id').split('_')[1] || 'all'
    }
    catch {
        var student_id = 'all'
    }
    var period_id = $('.reportDropdownList').find('.rowInput').attr('data-id').split('_')[1]

    const manager = localStorage.getItem('manager')
    if (manager) {
        request('get_group_for_student_name/' + manager)
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка');
                return false;
            }
            // TODO

            group_name = response.group_name

            fetch(`generate_report/${group_name}/${period_id}/${student_id}`)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Ошибка загрузки отчета:', error));

        })
        .catch((error) => {
            console.error(error)
        })

        
    }
    else {
        fetch(`generate_report/${group_name}/${period_id}/${student_id}`)
        .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Ошибка загрузки отчета:', error));
        }
    
})


// Отображение "Студенты" по группе
function render_group_students(group_id) {
    // Запрос в БД
    request('get_groups')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_groups = response.groups

        // Запрос в БД
        request(`get_students_for_group/${group_id}`)
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }

            // Отрисовка
            let data = response.students

            var adminTables = $('<div>', {
                'class': 'adminTables'
            });
            var rowsWrapper = $('<div>', {
                'class': 'rowsWrapper'
            });

            data.forEach((el, index) => {
                if (index == 0) {
                    render_header(rowsWrapper, Array('ФИО', 'Группа'))
                }

                var longRowWrapper = $('<div>', {
                    'class': 'longRowWrapper',
                    'data-id': `student_${el.student.id}`,
                })

                var deleteLongRowWrapper = $('<div>', {
                    'class': 'deleteLongRowWrapper',
                })
                
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper rowWrapper--long',
                })

                var dropdown_list = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })

                var dropdown_menu = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))

                all_groups.forEach((group) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `group_${group.id}`
                    }).text(group.group_name)

                    dropdown_menu.append(dropdownElement)
                })

                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.student.fullname
                })

                var dropdownInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.group.group_name,
                    'data-id': `group_${el.group.id}`,
                    'readonly': true
                })

                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })

                dropdown_list.append(dropdownInput, dropdown_menu)
                rowWrapper.append(rowInput)
                deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                rowsWrapper.append(longRowWrapper)
            })

            var btnsWrapper = $('<div>', {
                'class': 'btnsWrapper',
            })

            var addBtn = $('<div>', {
                'class': 'adminTablesBtn addBtn',
                'text': 'Добавить',
                'data-type': 'student'
            })

            btnsWrapper.append(addBtn)
            adminTables.append(rowsWrapper, btnsWrapper)
            $('.adminPanelWrapper').append(adminTables)
        })
        .catch((error) => {
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение "Предметов" по группе
function render_group_subjects(group_id) {
    // Запрос в БД
    request('get_specializations')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_groups = JSON.parse(response.specializations)
        // Запрос в БД
        request('get_subjects_for_specialization/' + group_id)
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }

            // Отрисовка
            let data = response.subjects

            var adminTables = $('<div>', {
                'class': 'adminTables'
            });
            
            var rowsWrapper = $('<div>', {
                'class': 'rowsWrapper'
            });

            data.forEach((el, index) => {
                if (index == 0) {
                    render_header(rowsWrapper, Array('Предмет', 'Группа'))
                }

                var longRowWrapper = $('<div>', {
                    'class': 'longRowWrapper',
                    'data-id': `subject_${el.id}`,
                })

                var deleteLongRowWrapper = $('<div>', {
                    'class': 'deleteLongRowWrapper',
                })
                
                var rowWrapper = $('<div>', {
                    'class': 'rowWrapper rowWrapper--long',
                })

                var dropdown_list = $('<div>', {
                    'class': 'rowWrapper dropdown-list'
                })

                var dropdown_menu = $('<ul>', {
                    'class': 'dropdown-menu'
                })

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement dropdownFirstElement'
                }))

                dropdown_menu.append($('<li>', {
                    'class': 'dropdownElement',
                    'data-id': `general`
                }).text('Общие'))


                all_groups.forEach((group) => {
                    var dropdownElement = $('<li>', {
                        'class': 'dropdownElement',
                        'data-id': `specialization_${group.pk}`
                    }).text(group.fields.name)

                    dropdown_menu.append(dropdownElement)
                })

                var rowInput = $('<input>', {
                    'type': 'text',
                    'class': 'rowInput',
                    'value': el.subject_name
                })

                if (el.group.group_name) {
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': el.group.group_name,
                        'data-id': `specialization_${el.group.group_id}`,
                        'readonly': true
                    })
                }
                else {
                    var dropdownInput = $('<input>', {
                        'type': 'text',
                        'class': 'rowInput',
                        'value': 'Общие',
                        'data-id': `general`,
                        'readonly': true
                    })
                }
                

                var deleteIcon = $('<img>', {
                    'class': 'deleteRow',
                    'src': staticUrl + 'img/delete.svg',
                })

                dropdown_list.append(dropdownInput, dropdown_menu)
                rowWrapper.append(rowInput)
                deleteLongRowWrapper.append(rowWrapper, dropdown_list)
                longRowWrapper.append(deleteLongRowWrapper, deleteIcon)
                rowsWrapper.append(longRowWrapper)
            })

            var btnsWrapper = $('<div>', {
                'class': 'btnsWrapper',
            })

            var addBtn = $('<div>', {
                'class': 'adminTablesBtn addBtn',
                'text': 'Добавить',
                'data-type': 'subject'
            })

            btnsWrapper.append(addBtn)
            adminTables.append(rowsWrapper, btnsWrapper)
            $('.adminPanelWrapper').append(adminTables)
        })
        .catch((error) => {
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

// Отображение "Оценок" по группе
function render_group_grades(group_id, period_id) {
    // Запрос в БД "Группы"
    request('get_periods')
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        var all_periods = JSON.parse(response.periods)

        // Запрос в БД "Студенты"
        request(('get_students_for_group/' + group_id))
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка')
                return false
            }
            var all_students = response.students

            request(('get_subjects'))
            .then((response) => {
                if (!response) {    
                    console.error('Неизвестная ошибка')
                    return false
                }

                var all_subjects = response.subjects
                // Запрос в БД "Пропуски"
                request(`get_grades_for_group/${group_id}/${period_id}`)
                .then((response) => {
                    if (!response) {
                        console.error('Неизвестная ошибка')
                        return false
                    }

                    // Отрисовка
                    let data = response.grades
                    // Подгрузка всех студентов группы
                    if (data.length == 0) {
                        all_students.forEach((student) => {
                            var send_data = {
                                'student_id': student.student.id, 
                                'period_id': period_id,
                            }
                            request('add_grade', send_data, 'POST')
                            .then((response) => {
                                if (!response) {
                                    console.error('Неизвестная ошибка')
                                    return false
                                }
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                        })

                        return render_group_grades(group_id, period_id)
                    }

                    else {
                        // Вычленить студентов, которых нет в data
                        var dataFullnames = data.map(function(item) {
                            return item.student.fullname;
                        });
            
                        var missingStudents = all_students.filter(function(student) {
                            return !dataFullnames.includes(student.student.fullname);
                        });

                        if (missingStudents.length > 0) {
                            const grades = data[0].grades
                            
                            // Чистка структуры от оценок
                            for (var i = 0; i < grades.length; i++) {
                                grades[i].grade = "";
                            }

                            // Догрузка дополнительных студентов
                            missingStudents.forEach((student) => {
                                var send_data = {
                                        student_id: student.student.id,
                                        period_id: period_id,
                                        grades: JSON.stringify(grades)
                                    };
                                    
                                request('add_grade', send_data, 'POST')
                                .then((response) => {
                                    if (!response) {
                                        console.error('Неизвестная ошибка')
                                        return false
                                    }
                                })
                                .catch((error) => {
                                    console.error(error)
                                })
                            })

                            return render_group_grades(group_id, period_id)
                        }
                    }

                    // Определение хедера по самому длинному полю grades
                    const header = defineHeader(data)
                    
                    var adminTables = $('<div>', {
                        'class': 'adminTables'
                    });
                    var rowsWrapper = $('<div>', {
                        'class': 'rowsWrapper'
                    });
                    data.forEach((el, index) => {
                        if (index == 0) {
                            render_header(rowsWrapper, header, long=false, grades=true)
                        }

                        var longRowWrapper = $('<div>', {
                            'class': 'longRowWrapper longRowWrapper--grades',
                            'data-id': `grade_${el.grade_id}`,
                        })

                        var deleteLongRowWrapper = $('<div>', {
                            'class': 'deleteLongRowWrapper',
                        })
 

                        // dropdown_list
                        var dropdown_list_student = $('<div>', {
                            'class': 'rowWrapper rowWrapper--long--grades  dropdown-list'
                        })

                        var dropdown_list_period = $('<div>', {
                            'class': 'rowWrapper rowWrapper--long--grades  dropdown-list'
                        })


                        // dropdown_menu
                        var dropdown_menu_student = $('<ul>', {
                            'class': 'dropdown-menu'
                        })

                        var dropdown_menu_period = $('<ul>', {
                            'class': 'dropdown-menu'
                        })

                        dropdown_menu_student.append($('<li>', {
                            'class': 'dropdownElement dropdownFirstElement'
                        }))

                        dropdown_menu_period.append($('<li>', {
                            'class': 'dropdownElement dropdownFirstElement'
                        }))


                        all_periods.forEach((period) => {
                            var dropdownElement = $('<li>', {
                                'class': 'dropdownElement',
                                'data-id': `period_${period.pk}`
                            }).text(period.fields.period)

                            dropdown_menu_period.append(dropdownElement)
                        })

                        all_students.forEach((student) => {
                            var dropdownElement = $('<li>', {
                                'class': 'dropdownElement',
                                'data-id': `student_${student.student.id}`
                            }).text(student.student.fullname)

                            dropdown_menu_student.append(dropdownElement)
                        })


                        // Row input
                        var rowInput_student = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                            'data-id': `student_${el.student.id}`,
                            'value': el.student.fullname,
                            'readonly': true,
                        })

                        var rowInput_period = $('<input>', {
                            'type': 'text',
                            'class': 'rowInput',
                            'value': el.period.period,
                            'data-id': `period_${el.period.id}`,
                            'readonly': true,
                        })

                        dropdown_list_student.append(rowInput_student, dropdown_menu_student)
                        dropdown_list_period.append(rowInput_period, dropdown_menu_period)

                        
                        deleteLongRowWrapper.append(dropdown_list_student, dropdown_list_period)

                        // Подгрузка предметов по хедеру
                        $.each(header.slice(2), function(index, value) {
                            const cur_grade = el?.grades?.find((item) => {
                                if (item.subject_name == value) {
                                    return item.grade
                                }
                            })

                            var rowWrapper_grade = $('<div>', {
                                'class': 'rowWrapper rowWrapper--long--grades ',
                            })

                            var rowInput_grade = $('<input>', {
                                'type': 'number',
                                'class': 'rowInput rowInput--grades',
                                'data-id': `subject_${value}`,
                                'value': cur_grade?.grade
                            })

                            rowWrapper_grade.append(rowInput_grade)

                            deleteLongRowWrapper.append(rowWrapper_grade)
                        });

                        
                        longRowWrapper.append(deleteLongRowWrapper)
                        rowsWrapper.append(longRowWrapper)
                    })

                    var btnsWrapper = $('<div>', {
                        'class': 'btnsWrapper',
                    })

                    var reportBtn = $('<div>', {
                        'class': 'adminTablesBtn reportBtn',
                        'text': 'Отчёт',
                    })

                    btnsWrapper.append(reportBtn)
                    adminTables.append(rowsWrapper, btnsWrapper)
                    $('.adminPanelWrapper').append(adminTables)
                })
                .catch((error) => {
                    console.error(error)
                })
            })
            .catch((error) => {
                console.error(error)
            })
        })
        .catch((error) => {
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error)
    })
}

// Выбор оценок по периоду и группе
$(document).on('click', '.addBtn--choicePeriodGroupBtn', function() {
    var group_id = ''
    try {
        group_id = $('.dropdown-list--group').find('.rowInput').attr('data-id').split('_')[1]
    }
    catch {}
    var period_id = $('.dropdown-list--period').find('.rowInput').attr('data-id').split('_')[1]

    const manager = localStorage.getItem('manager')
    if (manager) {
        request('get_group_for_student_name/' + manager)
        .then((response) => {
            if (!response) {
                console.error('Неизвестная ошибка');
                return false;
            }

            group_id = response.group_id
            
            closeChoiceGroupModal()
            $('.adminTables').remove()

            localStorage.setItem('group_id', group_id)
            localStorage.setItem('period_id', period_id)

            render_group_grades(group_id, period_id)
        })
        .catch((error) => {
            console.error(error)
        })
    }
    else {
        closeChoiceGroupModal()
        $('.adminTables').remove()
    
        localStorage.setItem('group_id', group_id)
        localStorage.setItem('period_id', period_id)
    
        render_group_grades(group_id, period_id)
    }

    
})


// Определение хедера таблицы
const defineHeader = (data) => {
    var maxGradesObject = data.reduce(function(max, obj) {
        return obj?.grades?.length > max?.grades?.length ? obj : max;
    });

    if (!maxGradesObject.grades) {
        return ['Студент', 'Период'];
    }

    var subjectNames = maxGradesObject.grades.map(function(grade) {
        return grade.subject_name;
    });  

    var newSubjects = ['Студент', 'Период'];
    subjectNames.unshift(newSubjects[0], newSubjects[1]);

    return subjectNames
}


// Открытие меню добавления предмета 
$(document).on('click', '.addSubjectBtn', function() {
    // Запрос предметов по группе
    request('get_subjects_for_group/' + localStorage.getItem('group_id'))
    .then((response) => {
        if (!response) {
            console.error('Неизвестная ошибка')
            return false
        }
        const all_subjects = response.subjects
        
        var choiceGroupModal = $('<div>').addClass('choiceGroupModal');
        var closeChoiceGroupModal = $('<div>').addClass('closeChoiceGroupModal').text('х');
        var labelFirstChoiceGroup = $('<label>').addClass('labelFirstChoiceGroup').attr('for', 'firstChoiceGroup').text('Выберите предмет');
        
        if (all_subjects.length == 0) {
            return alert('У группы нет ни одного предмета')
        }

        var rowWrapper = $('<div>').addClass('rowWrapper dropdown-list dropdown-list--group');
        var rowInput = $('<input>').attr({
            'type': 'text',
            'class': 'rowInput',
            'value': all_subjects[0].subject_name,
            'data-id': `subject_${all_subjects[0].id}`,
            'readonly': 'readonly'
        });
        var dropdownMenu = $('<ul>').addClass('dropdown-menu');
        var dropdownFirstElement = $('<li>').addClass('dropdownElement dropdownFirstElement');
        dropdownMenu.append(dropdownFirstElement)
        all_subjects.forEach((subject) => {
            var dropdownElement = $('<li>').addClass('dropdownElement dropdownElement--choiceGroupModal')
            .attr({'data-id': `subject_${subject.id}`, 'data-type': 'grades'}).text(subject.subject_name);
            dropdownMenu.append(dropdownElement)
        })
        choiceGroupModal.append(
            closeChoiceGroupModal,
            labelFirstChoiceGroup,
            rowWrapper.append(rowInput, dropdownMenu)
        );
        $('body').append(choiceGroupModal)
        $('.overlay').show()
    })
    .catch((error) => {
        console.error(error)
    })
})


// Ввод только оценок 2, 3, 4, 5
$(document).on('input', '.rowInput--grades', function(e) {
    const validGrades = ['2', '3', '4', '5'];
    const value = $(this).val();

    if (value.length > 1 || !validGrades.includes(value)) {
        $(this).val(value.slice(0, -1));
    }
});
