import { Package } from 'lucide-react';

const Empty = () => {
    return (
        <div className='result-empty'>
            <div className='result-icon-wrap'>
                <Package className='result-icon' strokeWidth={1.25} aria-hidden />
            </div>
            <div className='result-text-wrap'>
                <p className='result-empty-title'>Пока ничего не искали</p>
                <p className='result-empty-description'>Введите имя пакета выше — мы подтянем changelog и заметки к релизу</p>
            </div>
        </div>
    );
};

export default Empty;
